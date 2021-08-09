import { Injectable } from '@nestjs/common';
import e from 'express';
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
    const { winner, looser } = await this.getWinnerLooser(body);
    const newMatchHistory = this.createMatchHistory(
      winner.intra_id,
      looser.intra_id,
    );
    const result = await this.matchHistoryRepository.save(newMatchHistory);
    let updateResult = body.ladder
      ? await this.usersService.updateLadderLevelByMatch(winner, looser)
      : `not ladder game`;

    return { id: result.id, updateResult };
  }

  async findById(intra_id: string) {
    const p1_list = await this.matchHistoryRepository.find({ p1_id: intra_id });
    const p2_list = await this.matchHistoryRepository.find({ p2_id: intra_id });
    const concated_list = p1_list.concat(p2_list);

    concated_list.sort((a, b) => a.id - b.id);
    return concated_list;
  }

  async findAll() {
    return await this.matchHistoryRepository.find();
  }

  async clear() {
    return await this.matchHistoryRepository.clear();
  }

  createMatchHistory(winner_nick: string, looser_nick: string) {
    let newMatchHistory = new MatchHistory();

    newMatchHistory.p1_id = winner_nick;
    newMatchHistory.p2_id = looser_nick;
    newMatchHistory.winner = winner_nick;
    return newMatchHistory;
  }

  async getWinnerLooser(body) {
    const { p1_id, p2_id } = body;
    const winner_nick = body.winner;
    const looser_nick = p1_id === winner_nick ? p2_id : p1_id;
    let winner = await this.usersService.findByNickname(winner_nick);
    let looser = await this.usersService.findByNickname(looser_nick);

    return { winner, looser };
  }
}
