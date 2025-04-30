import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OAuth2Client } from 'google-auth-library'

@Injectable()
export class GoogleAuthService {
	private client: OAuth2Client

	constructor(private readonly configService: ConfigService) {
		this.client = new OAuth2Client(configService.get('GOOGLE_CLIENT'))
	}

	async verifyToken(idToken: string) {
		try {
			const ticket = await this.client.verifyIdToken({
				idToken,
				audience: this.configService.get('GOOGLE_CLIENT')
			})
			const payload = ticket.getPayload()
			return payload
		} catch (error) {
			throw new Error('Invalid token')
		}
	}
}
