import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { BooksModule } from './modules/books/books.module';
import { UsersModule } from './modules/users/users.module';
import { LoansModule } from './modules/loans/loans.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import {join} from 'path';

@Module({
  imports: [
    BooksModule,
    UsersModule,
    LoansModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      serveRoot: '/images',
    }),
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
