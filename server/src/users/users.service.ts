import { Injectable, Logger } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { UsersEntity } from './entities/users.entity';
import { UsersRepository } from './users.repository';
import { AlreadyExistException } from './execptions/already-exist-exception';
import { NotExistException } from './execptions/not-exist-exception';
import { SafeException } from './execptions/safe-exception';

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
    await this.safeCheck(nickname);
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
    await this.safeCheck(nickname);
    return await this.usersRepository.update(intra_id, updateUserDto);
  }

  async updateAuth(updateUserDto: UpdateUsersDto) {
    const { intra_id } = updateUserDto;
    await this.existCheck('intra_id', { intra_id }, intra_id);
    return await this.usersRepository.update(intra_id, updateUserDto);
  }

  async updateLadderLevelByMatch(winner: UsersEntity, looser: UsersEntity) {
    winner.ladder_level++;
    looser.ladder_level--;
    const winner_affected = await this.updateUser(winner);
    const looser_affected = await this.updateUser(looser);
    return { winner_affected, looser_affected };
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

  async safeCheck(nickname: string) {
    const isUsed =
      nickname.includes(`_`) ||
      nickname.includes(`#`) ||
      nickname.includes(`"`) ||
      nickname.includes(`--`) ||
      nickname.includes(`/*`) ||
      nickname.includes(`'`);
    if (isUsed) {
      const error = `nickname: ${nickname} includes unsafe character`;
      throw new SafeException(error);
    }
    return isUsed;
  }

  async updateUser(user: UsersEntity) {
    const { affected } = await this.usersRepository.update(user.intra_id, user);
    console.log(`${user.nickname}: ${user.state}[${affected}]`);
    return affected;
  }
}
