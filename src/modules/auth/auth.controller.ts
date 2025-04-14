import {
	Controller,
	Post,
	Body,
	Res,
	HttpCode,
	HttpStatus,
	Req
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginAuthDto } from './dto/login-auth.dto'
import { Public } from './decorators/public.decorator'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'
import { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService
	) {}

	@Public()
	@Post('login')
	signIn(
		@Res({ passthrough: true }) response: Response,
		@Body() signInDto: LoginAuthDto
	) {
		return this.authService.signIn(
			response,
			signInDto.email,
			signInDto.password
		)
	}

	@Public()
	@Post('register')
	register(@Body() createUserDto: CreateUserDto) {
		return this.usersService.createUser(null, createUserDto, null)
	}

	@Post('refresh')
	refresh(
		@Res({ passthrough: true }) response: Response,
		@Req() request: Request
	) {
		return this.authService.refreshToken(response, request)
	}

	@HttpCode(HttpStatus.OK)
	@Public()
	@Post('logout')
	logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('access_token')
		response.clearCookie('refresh_token')

		return { message: 'Logout successfully' }
	}
}
