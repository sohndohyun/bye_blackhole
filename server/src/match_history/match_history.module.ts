import { Module } from '@nestjs/common';
import { MatchHistoryService } from './match_history.service';
import { MatchHistoryController } from './match_history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistoryRepository } from './match_history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MatchHistoryRepository])],
  controllers: [MatchHistoryController],
  providers: [MatchHistoryService],
})
export class MatchHistoryModule {}
