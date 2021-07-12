import internal from 'stream';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm/index';

@Entity()
export class chat_room {

	@PrimaryColumn({length: 20})
	title: string;

	@Column()
	password: string;

	@Column("simple-array")
	messages: {nickname:string, msg:string, data:Date}[];

	@Column("simple-array")
	chat_member: {nickname:string, permission:string}[];

	@Column()
	security: string;
}