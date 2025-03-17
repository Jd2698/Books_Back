import { PrismaClient } from '@prisma/client'

export const booksListSeed: {
	id: number
	titulo: string
	fecha_publicacion: Date
	genero: string
	resumen?: string
	autor: string
	numero_paginas?: number
	numero_libros: number
	disponible: boolean
}[] = [
	{
		id: 1,
		titulo: 'Cien años de soledad',
		fecha_publicacion: new Date('1967-05-30'),
		genero: 'Realismo mágico',
		resumen:
			'La historia de la familia Buendía a lo largo de siete generaciones en Macondo.',
		autor: 'Gabriel García Márquez',
		numero_paginas: 471,
		numero_libros: 3,
		disponible: true
	},
	{
		id: 2,
		titulo: '1984',
		fecha_publicacion: new Date('1949-06-08'),
		genero: 'Ciencia ficción distópica',
		resumen:
			'Un mundo gobernado por un régimen totalitario donde el Gran Hermano lo controla todo.',
		autor: 'George Orwell',
		numero_paginas: 328,
		numero_libros: 2,
		disponible: true
	},
	{
		id: 3,
		titulo: 'El principito',
		fecha_publicacion: new Date('1943-04-06'),
		genero: 'Fábula',
		resumen:
			'Un aviador perdido en el desierto conoce a un pequeño príncipe de otro planeta.',
		autor: 'Antoine de Saint-Exupéry',
		numero_paginas: 96,
		numero_libros: 5,
		disponible: true
	},
	{
		id: 4,
		titulo: 'Los juegos del hambre',
		fecha_publicacion: new Date('2008-09-14'),
		genero: 'Ciencia ficción',
		resumen:
			'Katniss Everdeen lucha por sobrevivir en una competencia mortal televisada.',
		autor: 'Suzanne Collins',
		numero_paginas: 374,
		numero_libros: 4,
		disponible: true
	}
]

export class BookSeeder {
	constructor(private prisma: PrismaClient) {}

	async createBooks() {
		for (let book of booksListSeed) {
			await this.prisma.libro.create({
				data: {
					titulo: book.titulo,
					fecha_publicacion: book.fecha_publicacion,
					genero: book.genero,
					resumen: book.resumen,
					autor: book.autor,
					numero_paginas: book.numero_paginas,
					numero_libros: book.numero_libros,
					disponible: book.disponible
				}
			})
		}
		console.log('Books was created successfully')
	}
}
