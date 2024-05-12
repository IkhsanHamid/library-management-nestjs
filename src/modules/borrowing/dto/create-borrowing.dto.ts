import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBorrowingDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  memberId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  bookId: string;
}
