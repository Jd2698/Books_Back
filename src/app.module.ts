import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { BooksModule } from './modules/books/books.module'
import { UsersModule } from './modules/users/users.module'
import { LoansModule } from './modules/loans/loans.module'

@Module({
	imports: [BooksModule, UsersModule, LoansModule],
	controllers: [],
	providers: [PrismaService]
})
export class AppModule {}
