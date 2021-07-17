import internal from 'stream';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm/index';

@Entity()
export class ft_user {

	@PrimaryColumn()
	intra_id: string;

	@Column({length: 10, unique: true})
	nickname: string;

	@Column()
	icon: string;

	@Column()
	state: string;

	@Column("simple-array", {nullable: true, default: []})
	friend_list: string[];

	@Column("simple-array", {nullable: true, default: []})
	chat_room_list: string[];

	@Column("simple-array", {nullable: true, default: []})
	block_list: string[];
}