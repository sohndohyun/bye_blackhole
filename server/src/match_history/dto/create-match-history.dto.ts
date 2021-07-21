import { IsNotEmpty } from 'class-validator';
export class CreateMatchHistoryDto {
  @IsNotEmpty()
  readonly p1_id: string;

  @IsNotEmpty()
  readonly p2_id: string;

  @IsNotEmpty()
  readonly winner: string;
}
