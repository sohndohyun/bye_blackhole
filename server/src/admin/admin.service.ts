import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { chat_room } from 'src/Entity/ChatRoom.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateUsersDto } from '../users/dto/create-users.dto';

// import { validate } from 'class-validator';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(chat_room)
    private readonly chatRoomRepository: Repository<chat_room>,
  ) {}

  async create(createUserDto: CreateUsersDto) {
    return this.usersService.create(createUserDto);
  }

  async updateAdmin(updateAdmin) {
    const { intra_id, nickname } = updateAdmin;
    const user = await this.usersService.findByIntraId(intra_id);
    const nicknameSet = { oldNickname: user.nickname, newNickname: nickname };

    await this.usersService.updateAdmin(updateAdmin);
    return await this.applyChangedNickname(user, nicknameSet);
  }

  async findAll() {
    return this.usersService.findAll();
  }

  async clear() {
    return this.usersService.clear();
  }

  async remove(nickname: string) {
    return this.usersService.remove(nickname);
  }

  // behid functions are helper function

  async applyChangedNickname(user, nicknameSet) {
    for (let index = 0; index < user.chat_room.length; index++) {
      const title = user.chat_room[index];
      let chatRoom = await this.chatRoomRepository.findOne({ title });

      if (chatRoom) {
        chatRoom = this.renewChatRoom(chatRoom, nicknameSet);
        await this.chatRoomRepository.save(chatRoom);
      }
    }
  }

  renewChatRoom(chatRoom, nicknameSet): chat_room {
    let newChatRoom = chatRoom;

    if (newChatRoom.messages)
      newChatRoom.messages = this.newNicknameArray(
        newChatRoom.messages,
        nicknameSet,
      );
    if (newChatRoom.chat_member)
      newChatRoom.chat_member = this.newNicknameArray(
        newChatRoom.chat_member,
        nicknameSet,
      );
    if (newChatRoom.chat_banned)
      newChatRoom.chat_banned = this.newNicknameArray(
        newChatRoom.chat_banned,
        nicknameSet,
      );
    return newChatRoom;
  }

  newNicknameArray(arr, nicknameSet) {
    let newArray = [];

    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      const { newNickname, oldNickname } = nicknameSet;

      if (element.nickname === oldNickname) {
        let newElement = element;

        newElement.nickname = newNickname;
        newArray.push(newElement);
      } else newArray.push(element);
    }
    return newArray;
  }
}
