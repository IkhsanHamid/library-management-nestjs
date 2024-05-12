import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { webResponse } from '../../shared/web.model';
import { Member } from '@prisma/client';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Members')
@Controller('/api/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('insert')
  @ApiResponse({ status: 201, description: '' })
  @ApiResponse({
    status: 400,
    description: 'member has exists, please input another one name',
  })
  async create(
    @Body() createMemberDto: CreateMemberDto,
  ): Promise<webResponse<Member>> {
    const member = await this.membersService.create(createMemberDto);
    return {
      data: member,
    };
  }

  @Get('get')
  @ApiResponse({ status: 201, description: '' })
  async findAll(): Promise<webResponse<Member[]>> {
    return {
      data: await this.membersService.findAll(),
    };
  }

  @Get('getOne/:id')
  @ApiResponse({ status: 201, description: '' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string): Promise<webResponse<Member>> {
    return {
      data: await this.membersService.findOne(id),
    };
  }

  @Patch('update/:id')
  @ApiResponse({ status: 201, description: '' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<webResponse<Member>> {
    return {
      data: await this.membersService.update(id, updateMemberDto),
    };
  }

  @Delete('remove/:id')
  @ApiResponse({ status: 201, description: 'Success remove' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async remove(@Param('id') id: string): Promise<webResponse<string>> {
    return {
      data: await this.membersService.remove(id),
    };
  }

  @Get('getBorrowedCount/:id')
  @ApiResponse({ status: 201, description: '' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getBorrowedCount(
    @Param('id') id: string,
  ): Promise<webResponse<number>> {
    return {
      data: await this.membersService.getBorrowedBooksCount(id),
    };
  }
}
