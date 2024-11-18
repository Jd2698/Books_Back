import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsDateString()
  fechaPublicacion: Date;

  @IsNotEmpty()
  @IsString()
  genero: string;

  @IsOptional()
  @IsNumber()
  numPaginas?: number;

  @IsOptional()
  @IsString()
  resumen?: string;

  @IsString()
  @IsNotEmpty()
  autor: string;

  @IsNotEmpty()
  @IsNumber()
  stock_disponible: number;
}
