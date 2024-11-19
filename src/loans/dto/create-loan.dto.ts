import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateLoanDto {
  @IsNotEmpty()
  @IsNumber()
  usuarioId: number;

  @IsNotEmpty()
  @IsNumber()
  libroId: number;

  @IsNotEmpty()
  @IsDateString()
  fechaPrestamo: Date;

  @IsNotEmpty()
  @IsDateString()
  fechaDevolucion: Date;

  @IsOptional()
  @IsIn([0, 1], {
    message: 'Value must be 0 or 1',
  })
  entregado: number;
}
