import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { chat_room } from '../Entity/ChatRoom.entity';
import { game_room } from '../Entity/GameRoom.entity';
import { UsersEntity } from '../users/entities/users.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

// sayi
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([chat_room, game_room, UsersEntity, UsersRepository]),
  ],
  controllers: [LobbyController],
  providers: [LobbyService, UsersService],
})
export class LobbyModule {}
