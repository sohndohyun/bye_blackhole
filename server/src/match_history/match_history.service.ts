import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchHistoryDto } from './dto/update-match-history.dto';
import { MatchHistory } from './entities/match-history.entity';
import { MatchHistoryRepository } from './match_history.repository';

@Injectable()
export class MatchHistoryService {
  constructor(
    private readonly matchHistoryRepository: MatchHistoryRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(body) {
    const newMatchHistory = this.createMatchHistory(body);
    const result = await this.matchHistoryRepository.save(newMatchHistory);
    const updateResult = await this.usersService.updateUserByMatch(body);
    return { id: result.id, updateResult };
  }

  async findById(intra_id: string) {
    const p1_list = await this.matchHistoryRepository.find({ p1_id: intra_id });
    const p2_list = await this.matchHistoryRepository.find({ p2_id: intra_id });
    return p1_list.concat(p2_list);
  }

  async findAll() {
    return await this.matchHistoryRepository.find();
  }

  async clear() {
    return await this.matchHistoryRepository.clear();
  }

  createMatchHistory(body) {
    const { p1_id, p2_id, winner } = body;
    let newMatchHistory = new MatchHistory();
    newMatchHistory.p1_id = p1_id;
    newMatchHistory.p2_id = p2_id;
    newMatchHistory.winner = winner;
    return newMatchHistory;
  }
}
