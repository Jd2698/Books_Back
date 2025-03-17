import { PrismaClient } from '@prisma/client'
import { usersListSeed } from './user.seeder'
import { booksListSeed } from './book.seeder'
import { EstadoPrestamo } from '../../src/enums/estadoPrestamo.enum'

export const loansListSeed: {
	id: number
	usuario_id: number
	libro_id: number
	fecha_prestamo: Date
	fecha_devolucion: Date
	estado: string
}[] = [
	{
		id: 1,
		usuario_id: usersListSeed[0].id,
		libro_id: booksListSeed[0].id,
		fecha_prestamo: new Date('1967-05-30'),
		fecha_devolucion: new Date('1967-05-30'),
		estado: EstadoPrestamo.Pendiente
	},
	{
		id: 2,
		usuario_id: usersListSeed[1].id,
		libro_id: booksListSeed[1].id,
		fecha_prestamo: new Date('1967-05-30'),
		fecha_devolucion: new Date('1967-05-30'),
		estado: EstadoPrestamo.Devuelto
	},
	{
		id: 3,
		usuario_id: usersListSeed[1].id,
		libro_id: booksListSeed[2].id,
		fecha_prestamo: new Date('1967-05-30'),
		fecha_devolucion: new Date('1967-05-30'),
		estado: EstadoPrestamo.Pendiente
	}
]

export class LoanSeeder {
	constructor(private prisma: PrismaClient) {}

	async createLoans() {
		for (let loan of loansListSeed) {
			await this.prisma.prestamo.create({
				data: {
					usuario_id: loan.usuario_id,
					libro_id: loan.libro_id,
					fecha_prestamo: loan.fecha_prestamo,
					fecha_devolucion: loan.fecha_devolucion,
					estado: loan.estado
				}
			})
		}
		console.log('loans was created successfully')
	}
}
