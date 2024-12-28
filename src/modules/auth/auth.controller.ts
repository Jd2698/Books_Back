import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginAuthDto } from './dto/login-auth.dto'
import { Public } from './decorators/public.decorator'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService
	) {}

	@Public()
	@Post('login')
	signIn(@Body() signInDto: LoginAuthDto) {
		return this.authService.signIn(signInDto.email, signInDto.password)
	}

	@Public()
	@Post('register')
	register(@Body() createUserDto: CreateUserDto) {
		return this.usersService.createUser(createUserDto, null)
	}
}
