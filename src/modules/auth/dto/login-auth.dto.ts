import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginAuthDto {
	@ApiProperty({
		required: true,
		description: 'User email',
		default: 'admin@gmail.com'
	})
	@IsNotEmpty()
	@IsEmail()
	email: string

	@ApiProperty({
		required: true,
		description: 'User password',
		default: 'admin123'
	})
	@ApiProperty({})
	@IsNotEmpty()
	@IsString()
	password: string
}
