import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { BooksModule } from './modules/books/books.module'
import { UsersModule } from './modules/users/users.module'
import { LoansModule } from './modules/loans/loans.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AuthModule } from './modules/auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './modules/auth/auth.guard'

@Module({
	imports: [
		BooksModule,
		UsersModule,
		LoansModule,
		AuthModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'images'),
			serveRoot: '/images'
		})
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
