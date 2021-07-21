import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/index';
import { chat_room } from '../Entity/ChatRoom.entity';
import { game_room } from '../Entity/GameRoom.entity';
import { UsersService } from 'src/users/users.service';
import { UsersEntity } from '../users/entities/users.entity'

@Injectable()
export class LobbyService {
  constructor(
    @InjectRepository(chat_room)
    private readonly ChatRoomRepository: Repository<chat_room>,
    @InjectRepository(game_room)
    private readonly GameRoomRepository: Repository<game_room>,
    @InjectRepository(UsersEntity)
    private readonly UserRepository: Repository<UsersEntity>,
    private readonly usersService: UsersService,
  ) {}

  async getChatList(): Promise<
    { title: string; num: number; security: string }[]
  > {
    var data = await this.ChatRoomRepository.find();
    var chatList: Array<{ title: string; num: number; security: string }> = [];

    data?.map((chatRoom) => {
      if (chatRoom.security !== 'private')
        chatList.push({
          title: chatRoom.title,
          num: chatRoom.chat_member.length,
          security: chatRoom.security,
        });
    });

    return chatList;
  }

  async getGameList(): Promise<
    { p1: string; p2: string; speed: boolean; ladder: boolean }[]
  > {
    var data = await this.GameRoomRepository.find();
    var chatList: Array<{
      p1: string;
      p2: string;
      speed: boolean;
      ladder: boolean;
    }> = [];

    data?.map((chatRoom) => {
      chatList.push({
        p1: chatRoom.p1,
        p2: chatRoom.p2,
        speed: chatRoom.speed,
        ladder: chatRoom.ladder,
      });
    });

    return chatList;
  }

  async createChatRoom(
    title,
    password,
    security,
    owner_id,
  ): Promise<chat_room> {
    var rtn = await this.ChatRoomRepository.findOne({ title: title });
    if (!rtn) {
      const info = await this.UserRepository.findOne(owner_id);
      info.chat_room.push(title);
      await this.UserRepository.save(info);

      if (security === 'private') {
        const userID = title.split('_');
        if (userID[1] === owner_id) var otherID = userID[2];
        else var otherID = userID[1];
        const other_info = await this.UserRepository.findOne({
          nickname: otherID,
        });
        other_info.chat_room.push(title);
        await this.UserRepository.save(other_info);
      }

      return await this.ChatRoomRepository.save({
        title: title,
        password: password,
        security: security,
        chat_member: [{ nickname: owner_id, permission: 'owner' }],
        messages: [],
      });
    } else return null;
  }

  async createGameRoom(nickname, speed, ladder): Promise<game_room> {
    //매칭 중에는 userState(matching으로 변경)
    //매칭 안되면 null 리턴

    return await this.GameRoomRepository.save({
      p1: nickname,
      p2: 'p2',
      speed: speed,
      ladder: ladder,
    });
  }

  async getUserList(
    id: string,
  ): Promise<{ id: string; icon: string; state: string; isFriend: boolean }[]> {
    const { friend_list } = await this.usersService.findByNickname(id);
    const allUser = await this.usersService.findAll();
    let userList = [];
    allUser.forEach((v) => {
      const isFriend = friend_list ? friend_list.includes(v.intra_id) : false;
      userList.push({ id: v.nickname, icon: v.icon, state: v.state, isFriend });
    });
    return userList;
    /* const info = await this.UserRepository.findOne({ nickname: id });
    const isfrnd = (targetID) => {
      for (let i = 0; i < info.friend_list.length; i++) {
        if (info.friend_list[i] === targetID) return true;
      }
      return false;
    };

    const data = await this.UserRepository.find();
    var user: { id: string; icon: string; state: string; isFriend: boolean }[] =
      [];
    data.map((d) => {
      var isF = isfrnd(d.nickname);
      if (d.nickname !== id)
        user.push({
          id: d.nickname,
          icon: d.icon,
          state: d.state,
          isFriend: isF,
        });
    });
    return user;
	*/
  }

  async getMyChatList(id: string): Promise<{ title: string; num: number }[]> {
    const info = await this.UserRepository.findOne({ nickname: id });
    const isMyChat = (chatTitle) => {
      for (let i = 0; i < info.chat_room.length; i++) {
        if (info.chat_room[i] === chatTitle) return true;
      }
      return false;
    };

    const data = await this.ChatRoomRepository.find();
    var chat: { title: string; num: number }[] = [];
    data.map((d) => {
      var is_my_chat = isMyChat(d.title);
      if (is_my_chat) chat.push({ title: d.title, num: d.chat_member.length });
    });
    return chat;
  }

  async enterChatRoom(chatRoomID: string, id: string, password: string) {
    var chat_info = await this.ChatRoomRepository.findOne({
      title: chatRoomID,
    });
    if (
      (chat_info.security === 'protected' && chat_info.password === password) ||
      chat_info.security === 'public'
    ) {
      const user_info = await this.UserRepository.findOne({ nickname: id });
      const found_title = user_info.chat_room.find(
        (title) => title === chatRoomID,
      );
      if (found_title !== chatRoomID) {
        user_info.chat_room.push(chatRoomID);
        await this.UserRepository.save(user_info);
      }

      const found_user = chat_info.chat_member.find(
        (user) => user.nickname === id,
      );
      if (!found_user) {
        chat_info.chat_member.push({ nickname: id, permission: 'user' });
        await this.ChatRoomRepository.save(chat_info);
      }

      return true;
    } else return false;
  }

  async deleteMyChat(title: string, id: string) {
    var userInfo = await this.UserRepository.findOne({ nickname: id });
    let idx = userInfo.chat_room.indexOf(title);
    if (idx > -1) userInfo.chat_room.splice(idx, 1);
    await this.UserRepository.save(userInfo);

    var chat_info = await this.ChatRoomRepository.findOne({ title: title });
    const found_user = chat_info.chat_member.find(
      (user) => user.nickname === id,
    );
    //permission owner인 경우, 다른 사람에게 onwer 넘겨주기(admin중 한명?)

    idx = chat_info.chat_member.indexOf(found_user);
    if (idx > -1) chat_info.chat_member.splice(idx, 1);
    return await this.ChatRoomRepository.save(chat_info);
  }
}
