import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

export const usersListSeed: {
	id: number
	nombre: string
	email: string
	password: string
	rolId: number
}[] = [
		{
		id: 1,
		nombre: 'admin',
		email: 'admin@gmail.com',
		password: 'admin123',
		rolId: 1
	},
		{
		id: 2,
		nombre: 'pedro',
		email: 'pedro@gmail.com',
		password: 'pedro123',
		rolId: 2
	},
		{
		id: 3,
		nombre: 'martha',
		email: 'martha@gmail.com',
		password: 'martha123',
		rolId: 2
	}
]

export class UserSeeder {
	constructor(private prisma: PrismaClient) {}

	async createUsers() {
		for (let user of usersListSeed) {
			const createdUser = await this.prisma.usuario.create({
				data: {
					nombre: user.nombre,
					email: user.email,
					password: await hash(user.password, 2)
				}
			})

			await this.prisma.usuario_rol.create({
				data: {
					rol_id: user.rolId,
					usuario_id: createdUser.id
				}
			})
			console.log('users was created successfully')
		}
	}
}
