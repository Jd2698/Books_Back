import { IsEnum, IsNotEmpty } from 'class-validator'
import { CreateLoanDto } from './create-loan.dto'
import { PartialType } from '@nestjs/mapped-types'
import { EstadoPrestamo } from 'src/enums/estadoPrestamo.enum'

export class UpdateStatusLoan extends PartialType(CreateLoanDto) {
	@IsNotEmpty()
	@IsEnum(EstadoPrestamo)
	estado: string
}
