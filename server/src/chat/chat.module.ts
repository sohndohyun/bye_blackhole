import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import {chat_room} from '../Entity/ChatRoom.entity'
import {ft_user} from '../Entity/User.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([chat_room, ft_user])],
	controllers: [ChatController],
	providers: [ChatService]
})
export class ChatModule {}
