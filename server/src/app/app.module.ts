import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// sayi
import { AdminModule } from '../admin/admin.module';
import { UsersEntity } from '../users/entities/users.entity';
import { MatchHistory } from '../match_history/entities/match-history.entity';
import { ProfileModule } from '../profile/profile.module';
import { MatchHistoryModule } from 'src/match_history/match_history.module';
import { LogInOutModule } from 'src/login_out/login_out.module';
import { GameGateway } from 'src/game/game.gateway';
// jinkim
import { chat_room } from '../Entity/ChatRoom.entity';
import { game_room } from '../Entity/GameRoom.entity';
import { ChatModule } from 'src/chat/chat.module';
import { LobbyModule } from '../lobby/lobby.module';
import { AuthEntity } from 'src/login_out/entities/auth.entity';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db_postgres',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'transcendence',
      entities: [AuthEntity, UsersEntity, MatchHistory, chat_room, game_room],
      synchronize: true,
    }),
    LobbyModule,
    AdminModule,
    ProfileModule,
    MatchHistoryModule,
    ChatModule,
    LogInOutModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule {}
