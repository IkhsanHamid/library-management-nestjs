import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';

@Module({
  imports: [],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
