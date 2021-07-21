import { Injectable } from '@nestjs/common';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchHistoryDto } from './dto/update-match-history.dto';
import { MatchHistory } from './entities/match-history.entity';
import { MatchHistoryRepository } from './match_history.repository';

@Injectable()
export class MatchHistoryService {
  constructor(
    private readonly matchHistoryRepository: MatchHistoryRepository,
  ) {}
  async create(createMatchHistoryDto: CreateMatchHistoryDto) {
    const newMatchHistory = this.createMatchHistory(createMatchHistoryDto);
    const result = await this.matchHistoryRepository.save(newMatchHistory);
    return result;
  }

  async findById(intra_id: string) {
    const p1_list = await this.matchHistoryRepository.find({ p1_id: intra_id });
    const p2_list = await this.matchHistoryRepository.find({ p2_id: intra_id });
    return p1_list.concat(p2_list);
  }
  async findAll() {
    return await this.matchHistoryRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} matchHistory`;
  }

  update(id: number, updateMatchHistoryDto: UpdateMatchHistoryDto) {
    return `This action updates a #${id} matchHistory`;
  }

  async clear() {
    return await this.matchHistoryRepository.clear();
  }

  createMatchHistory(createMatchHistoryDto: CreateMatchHistoryDto) {
    const { p1_id, p2_id, winner } = createMatchHistoryDto;
    let newMatchHistory = new MatchHistory();
    newMatchHistory.p1_id = p1_id;
    newMatchHistory.p2_id = p2_id;
    newMatchHistory.winner = winner;
    return newMatchHistory;
  }
}
