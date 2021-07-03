import internal from 'stream';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm/index';

@Entity()
export class chat_room {
	//1씩 증가하는 id 부여.
	//@PrimaryGeneratedColumn('increment')
	//id: 'TEXT';

	@PrimaryColumn()
	id: string;

	@Column()
	password: string;

	@Column()
	owner_id: string;

	@Column()
	num: number;
}
