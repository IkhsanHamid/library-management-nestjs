import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';
import { PrismaService } from '../../shared/prisma.service';
import { Borrowing } from '@prisma/client';
import { BooksService } from '../books/books.service';
import { MembersService } from '../members/members.service';
import * as moment from 'moment';

@Injectable()
export class BorrowingService {
  constructor(
    private prismaService: PrismaService,
    private bookService: BooksService,
    private memberService: MembersService,
  ) {}
  async create(createBorrowingDto: CreateBorrowingDto): Promise<Borrowing> {
    try {
      const { memberId, bookId } = createBorrowingDto;

      const member = await this.memberService.findOne(memberId);
      const book = await this.bookService.findOne(bookId);

      if (member.isPunishment && member.freePunishmentAt) {
        if (member.freePunishmentAt <= new Date())
          throw new HttpException(
            `Member is in punishment until ${member.freePunishmentAt}`,
            HttpStatus.BAD_REQUEST,
          );
      }

      const checkBorrowedExists =
        await this.memberService.getBorrowedBooksCount(memberId);
      console.log(checkBorrowedExists);
      if (checkBorrowedExists >= 2) {
        throw new HttpException(
          'Member cannot borrow more than 2 books.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const create = await this.prismaService.borrowing.create({
        data: {
          memberId: member.id,
          bookId: book.id,
        },
      });

      if (create)
        await this.prismaService.book.update({
          where: {
            id: book.id,
          },
          data: {
            stock: book.stock - 1,
          },
        });

      return create;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Borrowing[]> {
    try {
      return await this.prismaService.borrowing.findMany({
        where: {
          returnedAt: { not: null },
          isDeleted: false,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Borrowing> {
    try {
      const borrowing = await this.prismaService.borrowing.findUnique({
        where: {
          id,
          isDeleted: false,
        },
      });
      if (!borrowing)
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      return borrowing;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number): Promise<string> {
    try {
      const find = await this.findOne(id);

      // format date
      const returnedAt = new Date();
      const borrowDate = new Date(find.borrowedAt);
      const formattedDateBorrow = moment(borrowDate).format('YYYYMMDD');
      const compare = moment().diff(formattedDateBorrow, 'days');

      let punishment = false,
        until: any;
      if (compare > 7) {
        punishment = true;
        // Calculate penalty period (3 days)
        const penaltyPeriod = 4 * 24 * 60 * 60 * 1000;
        const freePunishmentAt = new Date(returnedAt.getTime() + penaltyPeriod);
        until = freePunishmentAt;
        await this.prismaService.member.update({
          where: {
            id: find.memberId,
          },
          data: {
            isPunishment: true,
            freePunishmentAt,
          },
        });
      }
      await this.prismaService.borrowing.update({
        where: {
          id,
        },
        data: {
          returnedAt: new Date(),
        },
      });
      await this.remove(id);
      if (!punishment) {
        return `Success returned without punishment`;
      } else {
        return `Success returned with punishment you can borrow book in ${until} `;
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<string> {
    try {
      const find = await this.findOne(id);
      await this.prismaService.borrowing.update({
        where: {
          id: find.id,
        },
        data: {
          isDeleted: true,
        },
      });
      return 'Success remove';
    } catch (error) {
      throw error;
    }
  }
}
