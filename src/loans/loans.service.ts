import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateStatusLoan } from './dto/update-status-loan.dto';
import { BooksService } from 'src/books/books.service';
import { CreateLoanDto } from './dto/create-loan.dto';

@Injectable()
export class LoansService {
  constructor(
    private _prismaService: PrismaService,
    private _bookService: BooksService,
  ) {}

  async getAllLoans(): Promise<any> {
    return await this._prismaService.prestamo.findMany({
      include: {
        libro: true,
        usuario: true,
      },
    });
  }

  async getLoanById(loanId: number): Promise<any> {
    const foundLoan = await this._prismaService.prestamo.findFirst({
      where: {
        id: loanId,
      },
    });
    if (!foundLoan) throw new NotFoundException();
    return foundLoan;
  }

  async createLoan(loanData: CreateLoanDto): Promise<any> {
    try {
      // verificar la disponibilidad del libro segun el stock y los libros prestados
      const isDisponible = await this._bookService.verifyDisponibilidad(
        loanData.libroId,
      );

      if (!isDisponible) {
        throw new BadRequestException();
      }

      return await this._prismaService.prestamo.create({
        data: loanData,
      });
    } catch (error) {
      // errores que pueden haber
      if (error.code && error.code == 'P2003') {
        // console.log({ message: 'Conflict for foreignkey', code: 'p2003' })
        throw new ConflictException({
          message: 'Conflict for foreignkey.',
          statusCode: 409,
        });
      } else if (error.response) {
        if (error.status == 400) {
          throw new BadRequestException({
            message: 'Bad Request. Book not available.',
            statusCode: 400,
          });
        } else if (error.status == 404) {
          throw new NotFoundException({
            message: 'Not found. Book or User does not exist.',
            statusCode: 404,
          });
        }
      }

      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // actualizar el estado
  async updateStatusById(
    loanId: number,
    loanData: UpdateStatusLoan,
  ): Promise<any> {
    const updatedLoan = await this._prismaService.prestamo.update({
      where: {
        id: loanId,
      },
      data: {
        entregado: loanData.entregado,
      },
    });

    if (!updatedLoan) throw new NotFoundException();
    return updatedLoan;
  }

  async deleteLoan(loanId: number) {
    try {
      const foundLoan = await this._prismaService.prestamo.delete({
        where: {
          id: loanId,
        },
      });

      return foundLoan;
    } catch (error) {
      // console.log('error');
      throw new NotFoundException();
    }
  }
}
