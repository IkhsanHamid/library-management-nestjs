import { CreateMemberDto } from './create-member.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateMemberDto extends PickType(CreateMemberDto, [
  'name',
] as const) {}
