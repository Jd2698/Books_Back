import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class LoansService {
	constructor(private _prismaService: PrismaService) {}

	async getAllLoans(): Promise<any> {
		return await this._prismaService.prestamo.findMany({
			include: {
				libro: true,
				usuario: true
			}
		})
	}

	async getLoanById(loanId: number): Promise<any> {
		try {
			const loandFound = await this._prismaService.prestamo.findFirst({
				where: {
					id: loanId
				}
			})
			if (!loandFound) throw new NotFoundException()
			return loandFound
		} catch (error) {
			console.log(error)
			throw error
		}
	}

	async createLoan(loanData: any): Promise<any> {
		try {
			return await this._prismaService.prestamo.create({
				data: loanData
			})
		} catch (error) {
			if (error.code && error.code == 'P2003') {
				console.log({ message: 'Error foreignkey', code: 'p2003' })
				throw new ConflictException()
			}
			console.log(error)
			throw new InternalServerErrorException()
		}
	}
}
