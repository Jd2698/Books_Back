import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

export class UserSeeder {
	constructor(private prisma: PrismaClient) {}

	async createUser() {
		const createdUser = await this.prisma.usuario.create({
			data: {
				nombre: 'admin',
				email: 'admin@gmail.com',
				password: await hash('admin123', 2)
			}
		})

		console.log('usuario admin creado con exito')

		await this.prisma.usuario_rol.create({
			data: {
				rol_id: 1,
				usuario_id: createdUser.id
			}
		})
		console.log('relacion usuario rol creado con exito')
	}
}
