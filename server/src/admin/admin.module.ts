import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository])],
  controllers: [AdminController],
  providers: [UsersService],
})
export class AdminModule {}
