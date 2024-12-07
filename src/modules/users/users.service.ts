import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { deleteImage, saveImage } from 'src/common/utils/image.util'
import { join } from 'path'

@Injectable()
export class UsersService {
	constructor(private _prismaService: PrismaService) {}

	async getAllUsers(): Promise<CreateUserDto[]> {
		return await this._prismaService.usuario.findMany()
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
			if (!file) {
				userData.imagen = join('users', 'default.jpg')
			} else {
				const pathToSave = ['images', 'users']
				const { imagePath } = await saveImage(file, pathToSave)

				userData.imagen = imagePath
			}

			const userCreated = await this._prismaService.usuario.create({
				data: userData
			})

			return { ...userCreated }
		} catch (error) {
			userData.imagen && userData.imagen != 'users/default.jpg'
				? await deleteImage(userData.imagen)
				: ''

			if (error.code && error.code == 'P2002') {
				throw new ConflictException('Field email already is in use')
			}

			throw new InternalServerErrorException(error.message)
		}
	}

	async updateUser(
		userId: number,
		userData: UpdateUserDto,
		file: Express.Multer.File
	): Promise<UpdateUserDto> {
		try {
			const foundUsers = await this._prismaService.usuario.findFirst({
				where: { id: userId }
			})

			if (!foundUsers) {
				throw new Error('P2025')
			}

			if (file) {
				if (userData.imagen != 'users/default.jpg') {
					await deleteImage(userData.imagen)
				}

				const pathToSave = ['images', 'users']
				const { imagePath } = await saveImage(file, pathToSave)

				userData.imagen = imagePath
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

			if (error.code == 'P2025' || error.message == 'P2025') {
				throw new NotFoundException('User not found')
			}

			throw new InternalServerErrorException(error.message)
		}
	}

	async deleteUser(userId: number): Promise<CreateUserDto> {
		try {
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
