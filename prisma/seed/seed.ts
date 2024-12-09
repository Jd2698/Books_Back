import { PrismaClient } from '@prisma/client'
import { UserSeeder } from './user.seeder'
import { RolSeeder } from './rol.seeder'

const prisma = new PrismaClient()
async function main() {
	const userClass = new UserSeeder(prisma)
	const RolClass = new RolSeeder(prisma)

	console.log('Ejecutando seeders...')
	await RolClass.createRoles()
	await userClass.createUser()
	console.log('Seeders ejecutados correctamente')
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
