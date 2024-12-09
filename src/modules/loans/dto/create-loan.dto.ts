import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { EstadoPrestamo } from 'src/enums/estadoPrestamo.enum'

export class CreateLoanDto {
	@IsNotEmpty()
	@IsNumber()
	usuario_id: number

	@IsNotEmpty()
	@IsNumber()
	libro_id: number

	@IsNotEmpty()
	@IsDateString()
	fecha_prestamo: Date

	@IsNotEmpty()
	@IsDateString()
	fecha_devolucion: Date

	@IsNotEmpty()
	@IsEnum(EstadoPrestamo)
	estado: string
}
