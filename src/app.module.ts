import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [BooksModule, UsersModule, LoansModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
