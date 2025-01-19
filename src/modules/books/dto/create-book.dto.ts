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
import { ApiProperty } from '@nestjs/swagger'

export class CreateBookDto {
	@ApiProperty({
		description: 'The title of the book',
		example: 'The Great Book',
		minLength: 3
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	titulo: string

	@ApiProperty({
		description: 'The publication date of the book',
		example: '2025-01-19'
	})
	@IsNotEmpty()
	@IsDateString()
	fecha_publicacion: Date

	@ApiProperty({
		description: 'The genre of the book',
		example: 'Fiction',
		minLength: 1
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	genero: string

	@ApiProperty({
		description: 'The number of pages in the book (optional)',
		example: 350,
		required: false
	})
	@IsOptional()
	@IsNumber()
	@Min(0)
	numero_paginas?: number

	@ApiProperty({
		description: 'The total number of copies available of the book',
		example: 10
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	numero_libros: number

	@ApiProperty({
		description: 'A short summary of the book (optional)',
		example: 'An interesting book about adventures.',
		required: false
	})
	@IsOptional()
	@IsString()
	@MinLength(1)
	resumen?: string

	@ApiProperty({
		description: 'The author of the book',
		example: 'Juan Pérez'
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	autor: string

	@ApiProperty({
		description: 'Indicates if the book is available',
		example: true
	})
	@IsNotEmpty()
	@IsBoolean()
	disponible: boolean
}
