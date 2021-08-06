import { Injectable, Logger } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { UsersEntity } from './entities/users.entity';
import { UsersRepository } from './users.repository';
import { AlreadyExistException } from './execptions/already-exist-exception';
import { NotExistException } from './execptions/not-exist-exception';

// import { validate } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  private readonly logger = new Logger(UsersService.name);

  async create(createUsersDto: CreateUsersDto) {
    let newUser = new UsersEntity();
    const { intra_id, nickname, icon } = createUsersDto;
    newUser.intra_id = intra_id;
    newUser.nickname = nickname;
    newUser.icon = icon;
    newUser.state = 'on';
    await this.duplicateCheck('intra_id', { intra_id }, intra_id);
    await this.duplicateCheck('nickname', { nickname }, nickname);
    const usersEntity = await this.usersRepository.save(newUser).then((v) => v);
    return usersEntity;
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(intra_id: string) {
    return await this.usersRepository.findOne({ intra_id });
  }
  async findByIntraId(intra_id: string) {
    return await this.existCheck('intra_id', { intra_id }, intra_id);
  }

  async findByNickname(nickname: string) {
    return await this.existCheck('nickname', { nickname }, nickname);
  }

  async updateAdmin(updateUserDto: UpdateUsersDto) {
    const { intra_id, nickname } = updateUserDto;
    await this.existCheck('intra_id', { intra_id }, intra_id);
    await this.duplicateCheck('nickname', { nickname }, nickname);
    return await this.usersRepository.update(intra_id, updateUserDto);
  }

  async updateAuth(updateUserDto: UpdateUsersDto) {
    const { intra_id } = updateUserDto;
    await this.existCheck('intra_id', { intra_id }, intra_id);
    return await this.usersRepository.update(intra_id, updateUserDto);
  }

  async updateUserByMatch(body) {
    const { p1_id, p2_id, winner, ladder } = body;
    let p1 = await this.existCheck('nickname', { nickname: p1_id }, p1_id);
    let p2 = await this.existCheck('nickname', { nickname: p2_id }, p2_id);

    this.reneweMatchHistory(p1, p2.intra_id);
    this.reneweMatchHistory(p2, p1.intra_id);
    if (ladder) {
      const winPlayer = winner === p1_id ? p1 : p2;
      const looser = winner === p1_id ? p2 : p1;
      this.renewLadderLevel(winPlayer, looser);
    }
    const returnP1 = await this.usersRepository.update({ nickname: p1_id }, p1);
    const returnP2 = await this.usersRepository.update({ nickname: p2_id }, p2);
    return { p1: returnP1.affected, p2: returnP2.affected };
  }

  async addFriend(myID: string, otherID: string, isFriend: boolean) {
    let { friend_list } = await this.existCheck(
      'nickname',
      { nickname: myID },
      myID,
    );
    const { intra_id } = await this.existCheck(
      'nickname',
      { nickname: otherID },
      otherID,
    );
    const idx = friend_list.indexOf(intra_id);
    if (idx === -1 && isFriend) friend_list.push(intra_id);
    else if (idx > -1 && !isFriend) friend_list.splice(idx, 1);
    return this.usersRepository.update({ nickname: myID }, { friend_list });
  }

  async addBlock(myID: string, otherID: string, isBlock: boolean) {
    let { block_list } = await this.existCheck(
      'nickname',
      { nickname: myID },
      myID,
    );
    const { intra_id } = await this.existCheck(
      'nickname',
      { nickname: otherID },
      otherID,
    );
    const idx = block_list.indexOf(intra_id);
    if (idx === -1 && isBlock) block_list.push(intra_id);
    else if (idx > -1 && !isBlock) block_list.splice(idx, 1);
    return this.usersRepository.update({ nickname: myID }, { block_list });
  }

  async remove(nickname: string) {
    const byNick = await this.usersRepository.findOne({
      nickname: 'intra_dup',
    });
    console.log(byNick);
    const byID = await this.usersRepository.findOne({
      intra_id: 'sayi intra id',
    });
    console.log(byID);
    const result = await this.usersRepository.delete(nickname).then((v) => v);
    console.log(result);
    return result;
  }

  async clear() {
    await this.usersRepository.clear();
    return 'clear';
  }

  // helper functions

  async duplicateCheck(field: string, target: object, value: string) {
    const result = await this.usersRepository.findOne(target);
    if (result) {
      const error = `${field}: ${value} is already exist`;
      throw new AlreadyExistException(error);
    }
    return result;
  }

  async existCheck(field: string, target: object, value: string) {
    const result = await this.usersRepository.findOne(target);
    if (result === undefined) {
      const error = `${field}: ${value} is not exist`;
      throw new NotExistException(error);
    }
    return result;
  }

  reneweMatchHistory(user: UsersEntity, opponent: string) {
    if (user.match_history.length >= 5) user.match_history.splice(0, 1);
    user.match_history.push(opponent);
  }

  renewLadderLevel(winner: UsersEntity, looser: UsersEntity) {
    winner.ladder_level++;
    looser.ladder_level--;
  }
}
