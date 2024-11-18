import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
}
