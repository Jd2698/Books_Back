import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { BooksModule } from './modules/books/books.module'
import { UsersModule } from './modules/users/users.module'
import { LoansModule } from './modules/loans/loans.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AuthModule } from './modules/auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './modules/auth/guards/auth.guard'
import { RolesModule } from './modules/roles/roles.module'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'images'),
			serveRoot: '/images'
		}),
		BooksModule,
		UsersModule,
		LoansModule,
		AuthModule,
		RolesModule
	],
	controllers: [],
	providers: [
		PrismaService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	]
})
export class AppModule {}
