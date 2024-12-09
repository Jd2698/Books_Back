import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	async signIn(email: string, pass: string): Promise<any> {
		const foundUser: any = await this.usersService.getUserByEmail(email)
		if (!foundUser) {
			throw new NotFoundException('User not found')
		}

		const isMatch = await bcrypt.compare(pass, foundUser.password)

		if (!isMatch) {
			throw new UnauthorizedException()
		}

		const payload = {
			sub: foundUser.id,
			email: foundUser.email,
			rol: foundUser.usuario_rol[0].rol.name
		}
		return {
			access_token: await this.jwtService.signAsync(payload)
		}
	}
}
