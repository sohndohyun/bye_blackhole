import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import {chat_room} from '../Entity/ChatRoom.entity'
import {game_room} from '../Entity/GameRoom.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([chat_room, game_room])],
	controllers: [LobbyController],
	providers: [LobbyService]
})
export class LobbyModule {}
