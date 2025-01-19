import { ApiProperty } from '@nestjs/swagger'
import {
	IsString,
	IsOptional,
	IsNumber,
	IsBoolean,
	IsDate
} from 'class-validator'

export class Book {
	@ApiProperty({ example: 1, description: 'Unique identifier of the book' })
	@IsNumber()
	id: number

	@ApiProperty({ example: 'The Great Book', description: 'Title of the book' })
	@IsString()
	titulo: string

	@ApiProperty({
		example: '2025-01-19',
		description: 'Publication date of the book'
	})
	@IsDate()
	fecha_publicacion: Date

	@ApiProperty({ example: 'Fiction', description: 'Genre of the book' })
	@IsString()
	genero: string

	@ApiProperty({
		example: 'A great adventure story',
		description: 'Summary of the book',
		required: false
	})
	@IsOptional()
	@IsString()
	resumen?: string

	@ApiProperty({ example: 'Juan Pérez', description: 'Author of the book' })
	@IsString()
	autor: string

	@ApiProperty({ example: 350, description: 'Number of pages of the book' })
	@IsNumber()
	numero_paginas: number

	@ApiProperty({
		example: 10,
		description: 'Number of available copies of the book'
	})
	@IsNumber()
	numero_libros: number

	@ApiProperty({ example: true, description: 'Availability of the book' })
	@IsBoolean()
	disponible: boolean
}
