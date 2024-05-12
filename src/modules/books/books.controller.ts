import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { webResponse } from 'src/shared/web.model';
import { Book } from '@prisma/client';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('/api/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('insert')
  @ApiResponse({ status: 201, description: '' })
  @ApiResponse({
    status: 400,
    description: 'title has exists, please input another one name',
  })
  async create(
    @Body() createBookDto: CreateBookDto,
  ): Promise<webResponse<Book>> {
    return {
      data: await this.booksService.create(createBookDto),
    };
  }

  @Get('get')
  @ApiResponse({ status: 201, description: '' })
  async findAll(): Promise<webResponse<Book[]>> {
    return {
      data: await this.booksService.findAll(),
    };
  }

  @Get('getOne/:id')
  @ApiResponse({ status: 201, description: '' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string): Promise<webResponse<Book>> {
    return {
      data: await this.booksService.findOne(id),
    };
  }

  @Patch('update/:id')
  @ApiResponse({ status: 201, description: '' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<webResponse<Book>> {
    return {
      data: await this.booksService.update(id, updateBookDto),
    };
  }

  @Delete('remove/:id')
  @ApiResponse({ status: 201, description: '' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async remove(@Param('id') id: string): Promise<webResponse<string>> {
    return {
      data: await this.booksService.remove(id),
    };
  }
}
