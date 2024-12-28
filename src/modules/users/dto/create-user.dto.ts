import {
	IsEmail,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	nombre: string

	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsString()
	password: string

	@IsOptional()
	@IsNumberString()
	@MinLength(10)
	telefono: string

	@IsOptional()
	imagen: string

	@IsOptional()
	roleId?: string
}
