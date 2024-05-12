import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BorrowingService } from './borrowing.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';
import { webResponse } from 'src/shared/web.model';
import { Borrowing } from '@prisma/client';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Borrowing')
@Controller('/api/borrowing')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Post('insert')
  @ApiResponse({ status: 201, description: '' })
  @ApiResponse({
    status: 400,
    description: 'Member cannot borrow more than 2 books.',
  })
  @ApiResponse({
    status: 400,
    description: 'Member is in punishment',
  })
  async create(
    @Body() createBorrowingDto: CreateBorrowingDto,
  ): Promise<webResponse<Borrowing>> {
    return {
      data: await this.borrowingService.create(createBorrowingDto),
    };
  }

  @Get('get')
  @ApiResponse({ status: 201, description: '' })
  async findAll(): Promise<webResponse<Borrowing[]>> {
    return {
      data: await this.borrowingService.findAll(),
    };
  }

  @Get('getOne/:id')
  @ApiResponse({ status: 201, description: '' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string): Promise<webResponse<Borrowing>> {
    return {
      data: await this.borrowingService.findOne(+id),
    };
  }

  @Patch('update/:id')
  @ApiResponse({
    status: 201,
    description:
      'Success returned without punishment / Success returned with punishment you can borrow book in',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async update(@Param('id') id: string): Promise<webResponse<string>> {
    return {
      data: await this.borrowingService.update(+id),
    };
  }

  @Delete('remove/:id')
  @ApiResponse({ status: 201, description: 'Success remove' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async remove(@Param('id') id: string): Promise<webResponse<string>> {
    return {
      data: await this.borrowingService.remove(+id),
    };
  }
}
