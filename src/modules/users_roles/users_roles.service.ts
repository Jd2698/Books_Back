import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UsersRolesService {
	constructor(private prismaService: PrismaService) {}

	async create(userId: number, rolId: number): Promise<any> {
		return await this.prismaService.usuario_rol.create({
			data: {
				rol_id: rolId,
				usuario_id: userId
			}
		})
	}

	async update(
		id: number,
		data: { usuario_id?: number; rol_id?: number }
	): Promise<any> {
		return await this.prismaService.usuario_rol.update({
			where: {
				id
			},
			data
		})
	}

	async getbyUserId(userId: number): Promise<any> {
		return await this.prismaService.usuario_rol.findFirst({
			where: {
				usuario_id: userId
			}
		})
	}
}
