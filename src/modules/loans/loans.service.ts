import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UpdateStatusLoan } from './dto/update-status-loan.dto'
import { BooksService } from '../books/books.service'
import { CreateLoanDto } from './dto/create-loan.dto'
import { EstadoPrestamo } from 'src/enums/estadoPrestamo.enum'

@Injectable()
export class LoansService {
	constructor(
		private _prismaService: PrismaService,
		private _bookService: BooksService
	) {}

	async getAllLoans(): Promise<CreateLoanDto[]> {
		return await this._prismaService.prestamo.findMany({
			include: {
				libro: true,
				usuario: true
			}
		})
	}

	async getLoanById(loanId: number): Promise<CreateLoanDto> {
		const foundLoan = await this._prismaService.prestamo.findFirst({
			where: {
				id: loanId
			}
		})
		if (!foundLoan) throw new NotFoundException('Loan not found')
		return foundLoan
	}

	async createLoan(loanData: CreateLoanDto): Promise<CreateLoanDto> {
		try {
			// verificar disponibilidad del libro
			const dataVerifyAvailable = await this._bookService.verifyAvailability(
				loanData.libro_id
			)

			if (!dataVerifyAvailable.isAvailable) {
				throw new BadRequestException()
			}

			const loan = await this._prismaService.prestamo.create({
				data: loanData
			})

			// actualizar estado disponible en el libro
			await this._bookService.updateAvailability(
				EstadoPrestamo.Pendiente,
				dataVerifyAvailable.loanCount,
				dataVerifyAvailable.book
			)

			return loan
		} catch (error) {
			if (error.code && error.code == 'P2003') {
				throw new ConflictException('Foreignkey error')
			} else if (error.response) {
				if (error.status == 400) {
					throw new BadRequestException('Bad Request. Book not available')
				} else if (error.status == 404) {
					throw new NotFoundException('Not found. Book or User does not exist')
				}
			}

			throw new InternalServerErrorException(error.message)
		}
	}

	// actualizar el estado
	async updateStatusById(
		loanId: number,
		loanData: UpdateStatusLoan
	): Promise<any> {
		try {
			const updatedLoan = await this._prismaService.prestamo.update({
				where: {
					id: loanId
				},
				data: {
					estado: loanData.estado
				}
			})

			// verificar disponibilidad y actualizar estado disponible en el libro
			const { loanCount, book } = await this._bookService.verifyAvailability(
				updatedLoan.libro_id
			)

			await this._bookService.updateAvailability(
				loanData.estado,
				loanCount,
				book
			)

			return updatedLoan
		} catch (error) {
			if (error.code == 'P2025') {
				throw new NotFoundException('Loan not found')
			}

			throw new InternalServerErrorException(error.message)
		}
	}

	async deleteLoan(loanId: number): Promise<CreateLoanDto> {
		try {
			const foundLoan = await this._prismaService.prestamo.delete({
				where: {
					id: loanId
				}
			})

			// verificar disponibilidad y actualizar estado disponible en el libro
			const { loanCount, book } = await this._bookService.verifyAvailability(
				foundLoan.libro_id
			)

			await this._bookService.updateAvailability(
				EstadoPrestamo.Devuelto,
				loanCount,
				book
			)

			return foundLoan
		} catch (error) {
			throw new NotFoundException('Loan not found')
		}
	}
}
