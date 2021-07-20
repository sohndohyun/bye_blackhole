import { Module } from '@nestjs/common';
import { RoomController } from './roomList.controller';
import { RoomService } from './roomList.service';
import {chat_room} from './roomList.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([chat_room])],
	controllers: [RoomController],
	providers: [RoomService]
})
export class RoomModule {}
