import { Injectable } from '@nestjs/common';
import { MatchHistoryService } from '../match_history/match_history.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly matchHistoryService: MatchHistoryService,
    private readonly usersService: UsersService,
  ) {}

  async findProfileById(myID: string, otherID: string) {
    let profile = {};
    const { intra_id, ladder_level } = await this.usersService.findByNickname(
      otherID,
    );
    if (myID !== otherID) {
      const { friend_list, block_list } =
        await this.usersService.findByNickname(myID);
      const friend = this.nullCheckInclude(friend_list, intra_id);
      const block = this.nullCheckInclude(block_list, intra_id);
      profile = { friend, block };
    }
    const { history, win, lose } = await this.checkWin(intra_id);
    return { ...profile, history, win, lose, ladder: ladder_level };
  }

  async addFriend(myID: string, otherID: string, isFriend: boolean) {
    return await this.usersService.addFriend(myID, otherID, isFriend);
  }

  async getBlock(myID: string) {
    const user = await this.usersService.findByNickname(myID);
    let blocklist = [];
    for (let index = 0; index < user.block_list.length; index++) {
      const intra_id = user.block_list[index];
      const blockedUser = await this.usersService.findByIntraId(intra_id);
      blocklist.push(blockedUser.nickname);
    }
    return { blocklist };
  }

  async addBlock(myID: string, otherID: string, isBlock: boolean) {
    return await this.usersService.addBlock(myID, otherID, isBlock);
  }

  async findAll() {
    const users = await this.usersService.findAll();
    const history = await this.matchHistoryService.findAll();
    return { users, history };
  }

  async clear() {
    return await this.matchHistoryService.clear();
  }

  async findMyProfile(intra_id: string) {
    const user = await this.usersService.findOne(intra_id);
    return { id: user.nickname, icon: user.icon, state: user.state };
  }

  async setUserState(nickname: string, state: string) {
    const user = await this.usersService.findByNickname(nickname);

    user.state = state;
    console.log(`${nickname} update!`);
    return await this.usersService.updateUser(user);
  }
  // helper functions

  nullCheckInclude(list: string[], intra_id: string): boolean {
    if (list) return list.includes(intra_id);
    return false;
  }

  async checkWin(intra_id: string) {
    let profile = { history: [], win: 0, lose: 0 };
    const total_history = await this.matchHistoryService.findById(intra_id);

    if (total_history) {
      let count = 5;
      for (let index = total_history.length - 1; index >= 0; index--) {
        const { p1_id, p2_id, winner } = total_history[index];
        const player_id = p1_id === intra_id ? p2_id : p1_id;
        const { nickname } = await this.usersService.findByIntraId(player_id);
        let win = false;

        if (winner === intra_id) {
          profile.win++;
          win = true;
        }
        if (count-- > 0) profile.history.push({ id: nickname, win });
      }
      profile.lose = total_history.length - profile.win;
    }
    return profile;
  }
}
