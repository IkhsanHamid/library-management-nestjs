import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from '@prisma/client';
import { PrismaService } from '../../shared/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prismaService: PrismaService) {}
  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    try {
      const { name } = createMemberDto;
      await this.getDuplicate(name);

      const lastMember = await this.prismaService.member.findFirst({
        orderBy: {
          id: 'desc',
        },
      });

      let newId = 1;
      if (lastMember) {
        newId = Number(lastMember.id) + 1;
      }

      const generate = String(newId).padStart(3, '0');
      const code = `M${generate}`;

      return await this.prismaService.member.create({
        data: {
          code,
          name,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Member[]> {
    try {
      const result = await this.prismaService.member.findMany({
        where: {
          isDeleted: false,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findOne(code: string): Promise<Member> {
    try {
      const member = await this.prismaService.member.findUnique({
        where: {
          code,
          isDeleted: false,
        },
      });

      if (!member) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      return member;
    } catch (error) {
      throw error;
    }
  }

  async update(
    code: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    try {
      const find = await this.findOne(code);
      const { name } = updateMemberDto;
      const update = await this.prismaService.member.update({
        where: {
          id: find.id,
        },
        data: {
          name,
        },
      });
      return update;
    } catch (error) {
      throw error;
    }
  }

  async remove(code: string): Promise<string> {
    try {
      const find = await this.findOne(code);
      await this.prismaService.member.update({
        where: {
          id: find.id,
        },
        data: {
          isDeleted: true,
        },
      });
      return `Success remove ${find.name} from member`;
    } catch (error) {
      throw error;
    }
  }

  async getBorrowedBooksCount(memberId: string): Promise<number> {
    try {
      const find = await this.findOne(memberId);
      const borrowing = await this.prismaService.borrowing.count({
        where: {
          memberId: find.id,
          isDeleted: false,
        },
      });

      return borrowing;
    } catch (error) {
      throw error;
    }
  }

  async getDuplicate(name: string): Promise<boolean> {
    try {
      const result = await this.prismaService.member.findFirst({
        where: {
          name,
        },
      });

      if (result)
        throw new HttpException(
          'member has exists, please input another one name',
          HttpStatus.BAD_REQUEST,
        );
      return false;
    } catch (error) {
      throw error;
    }
  }
}
