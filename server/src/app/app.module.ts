import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { AppController } from './app.controller'
import { TypeOrmModule } from '@nestjs/typeorm';
import { LobbyModule } from '../lobby/lobby.module';
import { AdminModule } from '../admin/admin.module';
import { ft_user } from '../Entity/User.entity';
import { chat_room } from '../Entity/ChatRoom.entity';
import { game_room } from '../Entity/GameRoom.entity';
import { match_history } from '../Entity/MatchHistory.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
	imports: [TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'db_postgres',
		port: 5432,
		username: 'postgres',
		password: 'password',
		database: 'transcendence',
		entities: [ft_user, chat_room, game_room, match_history],
		synchronize: true,
	  }),
	  LobbyModule, AdminModule, ProfileModule, ChatModule],
	controllers: [AppController],
	providers: [AppGateway]
})
export class AppModule {}
