import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	UseGuards
} from '@nestjs/common'
import { BooksService } from './books.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { Public } from '../auth/decorators/public.decorator'
import { roles } from 'src/enums/roles.enum'
import { AdminGuard } from 'src/admin/admin.guard'
import { ApiResponse } from '@nestjs/swagger'
import { Book } from './interface/book.interface'

@Controller('books')
export class BooksController {
	constructor(private _bookService: BooksService) {}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: [Book]
	})
	@Public()
	@Get()
	getAllBooks() {
		return this._bookService.getAllBooks()
	}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: Book
	})
	@Public()
	@Get(':id')
	getBookById(@Param('id', ParseIntPipe) bookId: number) {
		return this._bookService.getBookById(bookId)
	}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: CreateBookDto
	})
	@UseGuards(new AdminGuard(roles.Admin))
	@Post('')
	createUser(@Body() newBook: CreateBookDto) {
		return this._bookService.createBook(newBook)
	}

	@UseGuards(new AdminGuard(roles.Admin))
	@Put(':id')
	updateBook(
		@Param('id', ParseIntPipe) bookId: number,
		@Body() newBook: UpdateBookDto
	) {
		return this._bookService.updateBook(bookId, newBook)
	}

	@UseGuards(new AdminGuard(roles.Admin))
	@Delete(':id')
	deleteUser(@Param('id', ParseIntPipe) bookId: number) {
		return this._bookService.deleteBook(bookId)
	}
}
