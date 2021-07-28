import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { chat_room } from 'src/Entity/ChatRoom.entity';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository, chat_room])],
  controllers: [AdminController],
  providers: [UsersService, AdminService],
})
export class AdminModule {}
