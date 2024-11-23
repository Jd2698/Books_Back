import {
	IsBoolean,
	IsDateString,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	MinLength
} from 'class-validator'

export class CreateBookDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	titulo: string

	@IsNotEmpty()
	@IsDateString()
	fechaPublicacion: Date

	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	genero: string

	@IsOptional()
	@IsNumber()
	@Min(0)
	numPaginas?: number

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	numLibros: number

	@IsOptional()
	@IsString()
	@MinLength(1)
	resumen?: string

	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	autor: string

	@IsNotEmpty()
	@IsBoolean()
	disponible: boolean
}
