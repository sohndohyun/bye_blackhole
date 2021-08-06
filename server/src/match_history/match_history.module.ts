import { Module } from '@nestjs/common';
import { MatchHistoryService } from './match_history.service';
import { MatchHistoryController } from './match_history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistoryRepository } from './match_history.repository';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchHistoryRepository, UsersRepository]),
  ],
  controllers: [MatchHistoryController],
  providers: [MatchHistoryService, UsersService],
})
export class MatchHistoryModule {}
