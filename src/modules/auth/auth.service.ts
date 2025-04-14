import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { CookieOptions, Request, Response } from 'express'

@Injectable()
export class AuthService {
	constructor(
		private _usersService: UsersService,
		private _jwtService: JwtService
	) {}

	async signIn(response: Response, email: string, pass: string): Promise<any> {
		const foundUser: any = await this._usersService.getUserByEmail(email)
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

		await this.createTokens(response, payload, true)
	}

	async refreshToken(response: Response, request: Request) {
		try {
			const refreshToken = request.cookies['refresh_token']
			if (!refreshToken) throw new Error()

			const { sub, email, rol, ...res } = await this._jwtService.verifyAsync(
				refreshToken
			)

			await this.createTokens(response, { sub, email, rol }, false)
		} catch (e) {
			throw new UnauthorizedException('Invalid refresh token')
		}
	}

	async createTokens(
		response: Response,
		payload: Record<string, any>,
		withRefreshToken: boolean
	): Promise<void> {
		const cookiesOptions: CookieOptions = {
			httpOnly: true,
			sameSite: 'strict',
			secure: false
		}

		const accessToken = await this._jwtService.signAsync(payload)

		response.cookie('access_token', accessToken, {
			...cookiesOptions,
			maxAge: 15 * 60 * 1000 // 15 minutes
		})

		if (withRefreshToken) {
			const refreshToken = await this._jwtService.signAsync(payload, {
				expiresIn: '7d'
			})

			response.cookie('refresh_token', refreshToken, {
				...cookiesOptions,
				maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
			})
		}
	}
}
