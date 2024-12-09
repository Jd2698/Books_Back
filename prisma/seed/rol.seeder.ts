export class RolSeeder {
	constructor(private prisma: any) {}

	async createRoles() {
		await this.prisma.rol.create({
			data: {
				name: 'admin'
			}
		})
		console.log('rol admin creado con exito')

		await this.prisma.rol.create({
			data: {
				name: 'client'
			}
		})
		console.log('rol client creado con exito')
	}
}
