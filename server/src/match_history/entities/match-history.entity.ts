import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateMatchHistoryDto } from '../dto/create-match-history.dto';
@Entity('MatchHistory')
export class MatchHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  p1_id: string;

  @Column()
  p2_id: string;

  @Column()
  winner: string;
}
