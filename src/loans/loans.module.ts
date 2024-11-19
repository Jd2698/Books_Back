import { Module } from '@nestjs/common';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { PrismaService } from 'src/prisma.service';
import { BooksService } from 'src/books/books.service';

@Module({
  controllers: [LoansController],
  providers: [LoansService, PrismaService, BooksService],
})
export class LoansModule {}
