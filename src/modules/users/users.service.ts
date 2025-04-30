import {
	ConflictException,
	ForbiddenException,
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
import * as crypto from 'crypto'
import { UsersRolesService } from '../users_roles/users_roles.service'
import { RolesService } from 'src/modules/roles/roles.service'
import { roles } from 'src/enums/roles.enum'

@Injectable()
export class UsersService {
	constructor(
		private prismaService: PrismaService,
		private userRolesService: UsersRolesService,
		private roleService: RolesService
	) {}

	async getAllUsers(): Promise<CreateUserDto[]> {
		return await this.prismaService.usuario.findMany()
	}

	async getUserByEmail(userEmail: string): Promise<any> {
		const foundUser = await this.prismaService.usuario.findFirst({
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

		// if (!foundUser) throw new NotFoundException('User not found')
		return foundUser
	}

	async getUserById(userId: number): Promise<CreateUserDto> {
		const user = await this.prismaService.usuario.findFirst({
			where: {
				id: userId
			}
		})

		if (!user) throw new NotFoundException('User not found')
		return user
	}

	async createGoogleUser(userData: { email: string; name: string }) {
		const rolId = (await this.roleService.findByName('client')).id

		const randomPassword = crypto.randomBytes(16).toString('hex')
		const hashedPassword = await bcrypt.hash(randomPassword, 10)
		const createdUser = await this.prismaService.usuario.create({
			data: {
				email: userData.email,
				nombre: userData.name,
				password: hashedPassword
			}
		})

		await this.userRolesService.create(createdUser.id, rolId)

		return createdUser
	}

	async createUser(
		userSession: { sub: number; email: string; rol: string },
		userData: CreateUserDto,
		file: Express.Multer.File
	): Promise<any> {
		try {
			const emailNotValid = await this.prismaService.usuario.findFirst({
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

			const { roleId, ...rest } = userData
			const createdUser = await this.prismaService.usuario.create({
				data: rest
			})

			let rolId: number
			if (userSession && userSession.rol == roles.Admin) {
				rolId =
					Number(roleId) || (await this.roleService.findByName('client')).id
			} else {
				rolId = (await this.roleService.findByName('client')).id
			}

			await this.userRolesService.create(createdUser.id, rolId)

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
			if (userSession.sub != userId && userSession.rol != roles.Admin)
				throw new ForbiddenException()

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

			const { roleId, ...rest } = userData

			const updatedUser = await this.prismaService.usuario.update({
				where: { id: userId },
				data: rest
			})

			if (userSession.rol == roles.Admin) {
				const userRoles = await this.userRolesService.getbyUserId(
					updatedUser.id
				)

				if (roleId != userRoles.rol_id) {
					console.log(userRoles, roleId)

					await this.userRolesService.update(userRoles.id, {
						rol_id: Number(roleId)
					})
				}
			}

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
			if (userSession.rol != roles.Admin) throw new UnauthorizedException()

			const deletedUser = await this.prismaService.usuario.delete({
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
