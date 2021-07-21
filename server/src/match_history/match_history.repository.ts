import { EntityRepository, Repository } from 'typeorm';
import { MatchHistory } from './entities/match-history.entity';

@EntityRepository(MatchHistory)
export class MatchHistoryRepository extends Repository<MatchHistory> {}
