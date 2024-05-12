import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @ApiPropertyOptional()
  title: string;

  @IsString()
  @ApiPropertyOptional()
  author: string;

  @IsString()
  @ApiPropertyOptional()
  stock: number;
}
