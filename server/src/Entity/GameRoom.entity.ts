import internal from 'stream';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm/index';

@Entity()
export class game_room {

	@PrimaryGeneratedColumn()
	id: number

	@Column()
	p1: string;

	@Column()
	p2: string;

	@Column()
	speed: boolean;

	@Column()
	ladder: boolean;
}