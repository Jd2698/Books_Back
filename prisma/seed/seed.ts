import { PrismaClient } from '@prisma/client'
import { UserSeeder } from './user.seeder'
import { RolSeeder } from './rol.seeder'
import { BookSeeder } from './book.seeder'
import { LoanSeeder } from './loan.seeder'

const prisma = new PrismaClient()
async function main() {
	const userClass = new UserSeeder(prisma)
	const rolClass = new RolSeeder(prisma)
	const bookSeeder = new BookSeeder(prisma)
	const loanSeeder = new LoanSeeder(prisma)

	console.log('Ejecutando seeders...')
	await rolClass.createRoles()
	await userClass.createUsers()
	await bookSeeder.createBooks()
	await loanSeeder.createLoans()
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
