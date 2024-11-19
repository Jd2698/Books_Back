import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private _prismaService: PrismaService) {}

  // obtener libros con un count de libros prestados
  async getAllBooks(): Promise<any> {
    const books = await this._prismaService.book.findMany({
      include: {
        _count: {
          select: {
            prestamos: {
              where: {
                entregado: 0,
              },
            },
          },
        },
      },
    });

    // agregar una propiedad para saber si esta disponible
    const booksWithStatus = books.map((v) => {
      if (v['_count'].prestamos >= v['stock_disponible']) {
        return { ...v, disponible: false };
      } else {
        return { ...v, disponible: true };
      }
    });

    return booksWithStatus;
  }

  async verifyDisponibilidad(bookId: number): Promise<any> {
    const foundBook = await this._prismaService.book.findFirst({
      where: {
        id: bookId,
      },
      include: {
        _count: {
          select: {
            prestamos: {
              where: {
                entregado: 0,
              },
            },
          },
        },
      },
    });
    if (!foundBook) throw new NotFoundException();

    if (foundBook['_count'].prestamos >= foundBook['stock_disponible']) {
      return false;
    } else {
      return true;
    }
  }

  async getBookById(bookId: number): Promise<any> {
    const book = await this._prismaService.book.findFirst({
      where: {
        id: bookId,
      },
    });

    if (!book) throw new NotFoundException();
    return book;
  }

  async createBook(bookData: CreateBookDto): Promise<any> {
    try {
      const createdBook = await this._prismaService.book.create({
        data: bookData,
      });

      return createdBook;
    } catch (error) {
      if (error.code && error.code == 'P2002') {
        console.log({
          message: 'Conflict error',
          code: 'p2002',
          field: 'titulo',
        });
        throw new ConflictException();
      }
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updateBook(bookId: number, bookData: UpdateBookDto): Promise<any> {
    const updatedBook = await this._prismaService.book.update({
      where: { id: bookId },
      data: bookData,
    });

    if (!updatedBook) throw new NotFoundException();
    return updatedBook;
  }

  async deleteBook(bookId: number): Promise<any> {
    try {
      const deletedBook = await this._prismaService.book.delete({
        where: { id: bookId },
      });

      return deletedBook;
    } catch (error) {
      if (error.code == 'P2003') {
        console.log({ message: 'Error foreignkey', code: 'P2003' });
        throw new ConflictException();
      } else if (error.code == 'P2025') {
        throw new NotFoundException();
      }

      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
