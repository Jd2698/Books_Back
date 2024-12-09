import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UsersRolesService {
	constructor(private _prismaService: PrismaService) {}

	async create(userId: number, rolId: number): Promise<any> {
		return await this._prismaService.usuario_rol.create({
			data: {
				rol_id: rolId,
				usuario_id: userId
			}
		})
	}
}
