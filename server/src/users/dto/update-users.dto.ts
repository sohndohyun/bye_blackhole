import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDto } from './create-users.dto';

export class UpdateUsersDto extends PartialType(CreateUsersDto) {
  //   friend_list: string[];
}
