import { Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { PrismaService } from 'src/prisma.service'
import { Role } from './entities/role.entity'

@Injectable()
export class RolesService {
	constructor(private _prismaService: PrismaService) {}

	async create(createRoleDto: CreateRoleDto) {
		return await this._prismaService.rol.create({
			data: createRoleDto
		})
	}

	async findAll() {
		return await this._prismaService.rol.findMany()
	}

	async findByName(name: string): Promise<Role> {
		return await this._prismaService.rol.findFirst({
			where: {
				name
			}
		})
	}

	async findOne(id: number) {
		return await this._prismaService.rol.findUnique({
			where: {
				id
			}
		})
	}

	async update(id: number, updateRoleDto: UpdateRoleDto) {
		return await this._prismaService.rol.update({
			where: {
				id
			},
			data: updateRoleDto
		})
	}

	async remove(id: number) {
		return await this._prismaService.rol.delete({
			where: {
				id
			}
		})
	}
}
