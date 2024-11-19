import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
	constructor(private _prismaService: PrismaService) {}

	async getAllUsers(): Promise<any> {
		return await this._prismaService.usuario.findMany()
	}

	async getUserById(userId: number): Promise<any> {
		const user = await this._prismaService.usuario.findFirst({
			where: {
				id: userId
			}
		})

		if (!user) throw new NotFoundException()
		return user
	}

	async createUser(userData: CreateUserDto): Promise<any> {
		try {
			const userCreated = await this._prismaService.usuario.create({
				data: userData
			})

			return userCreated
		} catch (error) {
			if (error.code && error.code == 'P2002') {
				console.log({ message: 'Conflict error', code: 'p2002' })
				throw new ConflictException()
			}
			console.log(error)
			throw new InternalServerErrorException()
		}
	}

	async updateUser(userId: number, userData: UpdateUserDto): Promise<any> {
		const updatedUser = await this._prismaService.usuario.update({
			where: { id: userId },
			data: userData
		})

		if (!updatedUser) throw new NotFoundException()
		return updatedUser
	}

	async deleteUser(userId: number): Promise<any> {
		const deletedUser = await this._prismaService.usuario.delete({
			where: { id: userId }
		})

		if (!deletedUser) throw new NotFoundException()
		return deletedUser
	}
}
