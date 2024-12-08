import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginAuthDto } from './dto/login-auth.dto'
import { Public } from './decorators/public.decorator'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('login')
	signIn(@Body() signInDto: LoginAuthDto) {
		return this.authService.signIn(signInDto.email, signInDto.password)
	}
}
