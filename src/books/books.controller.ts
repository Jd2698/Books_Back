import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private _bookService: BooksService) {}

  @Get()
  getAllBooks() {
    return this._bookService.getAllBooks();
  }

  @Get(':id')
  getBookById(@Param('id', ParseIntPipe) bookId: number) {
    return this._bookService.getBookById(bookId);
  }

  @Post('')
  createUser(@Body() newBook: CreateBookDto) {
    return this._bookService.createBook(newBook);
  }

  @Put(':id')
  updateBook(
    @Param('id', ParseIntPipe) bookId: number,
    @Body() newBook: UpdateBookDto,
  ) {
    return this._bookService.updateBook(bookId, newBook);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) bookId: number) {
    return this._bookService.deleteBook(bookId);
  }
}
