import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from '@prisma/client';
import { PrismaService } from '../../shared/prisma.service';
import { utils } from '../../shared/utils';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}
  async getDuplicateBook(title: string): Promise<boolean> {
    try {
      const result = await this.prismaService.book.findFirst({
        where: {
          title,
        },
      });
      if (result)
        throw new HttpException(
          'title has exists, please input another one name',
          HttpStatus.BAD_REQUEST,
        );
      return false;
    } catch (error) {
      throw error;
    }
  }
  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      const { title, author, stock } = createBookDto;

      await this.getDuplicateBook(title);

      const lastBook = await this.prismaService.book.findFirst({
        orderBy: {
          id: 'desc',
        },
      });

      let newId = 1;
      if (lastBook) {
        newId = Number(lastBook.id) + 1;
      }
      const generate = String(newId).padStart(3, '0');
      const randomString = utils.generate(3);
      const code = `${randomString}-${generate}`;

      return await this.prismaService.book.create({
        data: {
          code,
          title,
          author,
          stock,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Book[]> {
    try {
      return await this.prismaService.book.findMany({
        where: {
          isDeleted: false,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(code: string): Promise<Book> {
    try {
      const book = await this.prismaService.book.findUnique({
        where: {
          code,
          isDeleted: false,
        },
      });
      if (!book) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      return book;
    } catch (error) {
      throw error;
    }
  }

  async update(code: string, updateBookDto: UpdateBookDto) {
    try {
      const find = await this.findOne(code);
      const { title, author, stock } = updateBookDto;
      return await this.prismaService.book.update({
        where: {
          id: find.id,
        },
        data: {
          title,
          author,
          stock,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(code: string) {
    try {
      const find = await this.findOne(code);
      await this.prismaService.book.update({
        where: {
          id: find.id,
        },
        data: {
          isDeleted: true,
        },
      });
      return `Success remove ${find.title} from book`;
    } catch (error) {
      throw error;
    }
  }
}
