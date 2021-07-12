import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { AppController } from './app.controller'
import { TypeOrmModule } from '@nestjs/typeorm';
import { LobbyModule } from '../lobby/lobby.module';
import { AdminModule } from '../admin/admin.module';
import { ft_user } from '../Entity/User.entity';
import { chat_room } from '../Entity/ChatRoom.entity';
import { game_room } from '../Entity/GameRoom.entity';

@Module({
	imports: [TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'db_postgres',
		port: 5432,
		username: 'postgres',
		password: 'password',
		database: 'transcendence',
		entities: [ft_user, chat_room, game_room],
		synchronize: true,
	  }),
	  LobbyModule, AdminModule],
	controllers: [AppController],
	providers: [AppGateway]
})
export class AppModule {}
