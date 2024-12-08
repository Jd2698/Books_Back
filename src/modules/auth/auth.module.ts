import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersService } from '../users/users.service'
import { PrismaService } from 'src/prisma.service'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			global: true,
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '180s' }
		})
	],
	controllers: [AuthController],
	providers: [AuthService, UsersService, PrismaService]
})
export class AuthModule {}
