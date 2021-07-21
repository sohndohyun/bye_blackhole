import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { ProfileService } from './profile.service';
import { MatchHistoryService } from 'src/match_history/match_history.service';
import { MatchHistoryRepository } from 'src/match_history/match_history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository, MatchHistoryRepository]),
  ],
  controllers: [ProfileController],
  providers: [UsersService, MatchHistoryService, ProfileService],
})
export class ProfileModule {}
