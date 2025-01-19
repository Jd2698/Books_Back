import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	Req,
	UnauthorizedException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { EstadoPrestamo } from 'src/enums/estadoPrestamo.enum'
import { roles } from 'src/enums/roles.enum'

@Injectable()
export class BooksService {
	constructor(private _prismaService: PrismaService) {}

	// obtener libros con un count de libros prestados
	async getAllBooks(): Promise<CreateBookDto[]> {
		const books = await this._prismaService.libro.findMany({
			include: {
				_count: {
					select: {
						prestamos: {
							where: {
								estado: EstadoPrestamo.Pendiente
							}
						}
					}
				}
			}
		})

		return books
	}

	async getBookById(bookId: number): Promise<any> {
		const book = await this._prismaService.libro.findFirst({
			where: {
				id: bookId
			}
		})

		if (!book) throw new NotFoundException('Book not found')
		return book
	}

	async createBook(bookData: CreateBookDto): Promise<CreateBookDto> {
		try {
			const createdBook = await this._prismaService.libro.create({
				data: bookData
			})

			return createdBook
		} catch (error) {
			if (error.code && error.code == 'P2002') {
				throw new ConflictException('Conflict error for title')
			}

			throw new InternalServerErrorException()
		}
	}

	async updateBook(
		bookId: number,
		bookData: UpdateBookDto
	): Promise<UpdateBookDto> {
		try {
			const updatedBook = await this._prismaService.libro.update({
				where: { id: bookId },
				data: bookData
			})

			return updatedBook
		} catch (error) {
			if (error.code == 'P2025') {
				throw new NotFoundException('Book not found')
			}

			throw new InternalServerErrorException()
		}
	}

	async deleteBook(bookId: number): Promise<CreateBookDto> {
		try {
			const deletedBook = await this._prismaService.libro.delete({
				where: { id: bookId }
			})

			return deletedBook
		} catch (error) {
			if (error.code == 'P2003') {
				throw new ConflictException('Foreignkey error')
			} else if (error.code == 'P2025') {
				throw new NotFoundException('Book not found')
			}

			throw new InternalServerErrorException()
		}
	}

	async verifyAvailability(
		bookId: number
	): Promise<{
		isAvailable: boolean
		loanCount: number
		book: CreateBookDto
	}> {
		const foundBook = await this._prismaService.libro.findFirst({
			where: {
				id: bookId
			},
			include: {
				_count: {
					select: {
						prestamos: {
							where: {
								estado: EstadoPrestamo.Pendiente
							}
						}
					}
				}
			}
		})

		if (!foundBook) throw new NotFoundException()

		const isAvailable = foundBook['_count'].prestamos < foundBook['numLibros']

		return {
			isAvailable,
			loanCount: foundBook['_count'].prestamos,
			book: foundBook
		}
	}

	async updateAvailability(status: string, quantityLoans: number, book: any) {
		let isAvailable: boolean

		if (status == EstadoPrestamo.Pendiente) {
			isAvailable = quantityLoans + 1 < book.numLibros
		} else if (status == EstadoPrestamo.Devuelto) {
			isAvailable = quantityLoans - 1 < book.numLibros
		}

		await this._prismaService.libro.update({
			where: { id: book.id },
			data: {
				disponible: isAvailable
			}
		})
	}
}
