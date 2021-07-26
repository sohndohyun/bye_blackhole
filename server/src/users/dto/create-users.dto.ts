import { IsNotEmpty } from 'class-validator';

export class CreateUsersDto {
  @IsNotEmpty()
  readonly intra_id: string;
  @IsNotEmpty()
  readonly nickname: string;
  @IsNotEmpty()
  readonly auth_token: string;
  @IsNotEmpty()
  readonly icon: string;
}
