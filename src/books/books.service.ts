import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'

@Injectable()
export class BooksService {
	constructor(private _prismaService: PrismaService) {}

	async getAllBooks(): Promise<any> {
		return await this._prismaService.book.findMany()
	}

	async getBookById(bookId: number): Promise<any> {
		const book = await this._prismaService.book.findFirst({
			where: {
				id: bookId
			}
		})

		if (!book) throw new NotFoundException()
		return book
	}

	async createBook(bookData: CreateBookDto): Promise<any> {
		try {
			const createdBook = await this._prismaService.book.create({
				data: bookData
			})

			return createdBook
		} catch (error) {
			if (error.code && error.code == 'P2002') {
				console.log({ message: 'Conflict error', code: 'p2002', field: 'titulo' })
				throw new ConflictException()
			}
			console.log(error)
			throw new InternalServerErrorException()
		}
	}

	async updateBook(bookId: number, bookData: UpdateBookDto): Promise<any> {
		const updatedBook = await this._prismaService.book.update({
			where: { id: bookId },
			data: bookData
		})

		if (!updatedBook) throw new NotFoundException()
		return updatedBook
	}

	async deleteBook(bookId: number): Promise<any> {
		const deletedBook = await this._prismaService.book.delete({
			where: { id: bookId }
		})

		if (!deletedBook) throw new NotFoundException()
		return deletedBook
	}
}
