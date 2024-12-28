import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { deleteImage, saveImage } from 'src/common/utils/image.util'
import * as bcrypt from 'bcrypt'
import { UsersRolesService } from './users_roles.service'
import { RolesService } from 'src/roles/roles.service'

@Injectable()
export class UsersService {
	constructor(
		private _prismaService: PrismaService,
		private _userRolesService: UsersRolesService,
		private _roleService: RolesService
	) {}

	async getAllUsers(): Promise<CreateUserDto[]> {
		return await this._prismaService.usuario.findMany()
	}

	async getUserByEmail(userEmail: string): Promise<CreateUserDto> {
		const foundUser = await this._prismaService.usuario.findFirst({
			where: {
				email: userEmail
			},
			include: {
				usuario_rol: {
					include: {
						rol: true
					}
				}
			}
		})

		if (!foundUser) throw new NotFoundException('User not found')
		return foundUser
	}

	async getUserById(userId: number): Promise<CreateUserDto> {
		const user = await this._prismaService.usuario.findFirst({
			where: {
				id: userId
			}
		})

		if (!user) throw new NotFoundException('User not found')
		return user
	}

	async createUser(
		userData: CreateUserDto,
		file: Express.Multer.File
	): Promise<any> {
		try {
			const emailNotValid = await this._prismaService.usuario.findFirst({
				where: {
					email: userData.email
				}
			})

			if (emailNotValid) throw new Error('P2002')

			if (!file) {
				userData.imagen = 'users/default.jpg'
			} else {
				const pathToSave = ['images', 'users']
				const { imagePath } = await saveImage(file, pathToSave)

				userData.imagen = imagePath
			}

			userData.password = await bcrypt.hash(userData.password, 2)

			const createdUser = await this._prismaService.usuario.create({
				data: userData
			})

			const roleId =
				parseInt(userData.roleId) ||
				(await this._roleService.findByName('client')).id

			await this._userRolesService.create(createdUser.id, roleId)

			return { ...createdUser }
		} catch (error) {
			userData.imagen && userData.imagen != 'users/default.jpg'
				? await deleteImage(userData.imagen)
				: ''

			if (error.message == 'P2002') {
				throw new ConflictException('Field email already is in use')
			}

			throw new InternalServerErrorException(error.message)
		}
	}

	async updateUser(
		userSession: { sub: number; email: string; rol: string },
		userId: number,
		userData: UpdateUserDto,
		file: Express.Multer.File
	): Promise<UpdateUserDto> {
		try {
			if (userSession.sub != userId && userSession.rol != 'admin')
				throw new UnauthorizedException()

			// validar que exista
			await this.getUserById(userId)

			if (file) {
				if (userData.imagen != 'users/default.jpg') {
					await deleteImage(userData.imagen)
				}

				const pathToSave = ['images', 'users']
				const { imagePath } = await saveImage(file, pathToSave)

				userData.imagen = imagePath
			}

			// si se envia una nueva password
			if (userData?.password) {
				userData.password = await bcrypt.hash(userData.password, 2)
			}

			const updatedUser = await this._prismaService.usuario.update({
				where: { id: userId },
				data: userData
			})

			return updatedUser
		} catch (error) {
			userData.imagen && userData.imagen != 'users/default.jpg'
				? await deleteImage(userData.imagen)
				: ''

			throw new InternalServerErrorException(error.message)
		}
	}

	async deleteUser(
		userSession: { sub: number; email: string; rol: string },
		userId: number
	): Promise<CreateUserDto> {
		try {
			if (userSession.rol != 'admin') throw new UnauthorizedException()

			const deletedUser = await this._prismaService.usuario.delete({
				where: { id: userId }
			})

			if (deletedUser.imagen != 'users/default.jpg') {
				await deleteImage(deletedUser.imagen)
			}

			return deletedUser
		} catch (error) {
			if (error.code == 'P2025') {
				throw new NotFoundException('User not found')
			}

			throw new InternalServerErrorException(error.message)
		}
	}
}
