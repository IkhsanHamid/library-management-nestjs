import { Global, Module } from '@nestjs/common';
import { BooksModule } from './modules/books/books.module';
import { BorrowingModule } from './modules/borrowing/borrowing.module';
import { MembersModule } from './modules/members/members.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './shared/prisma.service';
import { BooksService } from './modules/books/books.service';
import { MembersService } from './modules/members/members.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BooksModule,
    BorrowingModule,
    MembersModule,
  ],
  controllers: [],
  providers: [PrismaService, BooksService, MembersService],
  exports: [PrismaService, BooksService, MembersService],
})
export class AppModule {}
