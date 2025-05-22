import { ApiProperty } from '@nestjs/swagger'
import {
	IsEmail,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'
import { roles } from 'src/enums/roles.enum'

export class CreateUserDto {
	@ApiProperty({
		example: 'pepe',
		minLength: 1,
		type: String
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	nombre: string

	@ApiProperty({
		example: 'pepe@gmail.com'
	})
	@IsNotEmpty()
	@IsEmail()
	email: string

	@ApiProperty({
		example: 'password example'
	})
	@IsNotEmpty()
	@IsString()
	password: string

	@ApiProperty({
		required: false,
		minLength: 10,
		type: Number,
		example: '123321123'
	})
	@IsOptional()
	@IsNumberString()
	@MinLength(10)
	telefono: string

	@ApiProperty({
		required: false
	})
	@IsOptional()
	imagen: string

	@ApiProperty({
		required: false,
		example: roles.Client,
		enum: roles
	})
	@IsOptional()
	roleId?: string
}
