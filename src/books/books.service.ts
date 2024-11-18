import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private _prismaService: PrismaService) {}

  async getAllBooks(): Promise<any> {
    return await this._prismaService.book.findMany();
  }

  async getBook(bookId: number): Promise<any> {
    return await this._prismaService.book.findFirst({
      where: {
        id: bookId,
      },
    });
  }

  async createBook(newBook: CreateBookDto): Promise<any> {
    const createdBook = await this._prismaService.book.create({
      data: newBook,
    });

    return createdBook;
  }

  async updateBook(bookId: number, book: UpdateBookDto): Promise<any> {
    const updatedBook = await this._prismaService.book.update({
      where: { id: bookId },
      data: book,
    });

    return updatedBook;
  }

  async deleteBook(bookId: number): Promise<any> {
    const deletedBook = await this._prismaService.book.delete({
      where: { id: bookId },
    });

    return deletedBook;
  }
}
