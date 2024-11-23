import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { EstadoPrestamo } from 'src/enums/estadoPrestamo.enum'

export class CreateLoanDto {
	@IsNotEmpty()
	@IsNumber()
	usuarioId: number

	@IsNotEmpty()
	@IsNumber()
	libroId: number

	@IsNotEmpty()
	@IsDateString()
	fechaPrestamo: Date

	@IsNotEmpty()
	@IsDateString()
	fechaDevolucion: Date

	@IsNotEmpty()
	@IsEnum(EstadoPrestamo)
	estado: string
}
