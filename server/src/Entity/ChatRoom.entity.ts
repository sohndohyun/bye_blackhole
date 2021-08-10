import internal from 'stream';
import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm/index';

@Entity()
export class chat_room {
  @PrimaryColumn({ length: 20 })
  title: string;

  @Column()
  password: string;

  @Column({ type: 'jsonb', array: false, default: [], nullable: true })
  messages: Array<{
    nickname: string;
    msg: string;
    date: Date;
    sysMsg: boolean;
  }>;

  @Column({ type: 'jsonb', array: false, default: [], nullable: true })
  chat_member: Array<{ nickname: string; permission: string }>;

  @Column({ type: 'jsonb', array: false, default: [], nullable: true })
  chat_banned: Array<{ nickname: string; date: Date }>;

  @Column()
  security: string;
}
