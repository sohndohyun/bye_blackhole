import internal from 'stream';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm/index';

@Entity()
export class match_history {

	@PrimaryGeneratedColumn()
	id: number

	@Column()
	p1: string

	@Column()
	p2: string

	@Column()
	winner: string
}