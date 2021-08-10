import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/index';
import { chat_room } from '../Entity/ChatRoom.entity';
import { UsersEntity } from '../users/entities/users.entity';
import * as md5 from 'md5'
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(chat_room)
    private readonly ChatRoomRepository: Repository<chat_room>,
    @InjectRepository(UsersEntity)
    private readonly UserRepository: Repository<UsersEntity>,
  ) {}

  async getChatRoomInfo(title: string) {
    const room_info = await this.ChatRoomRepository.findOne({ title: title });
    var chat_mem: { id: string; permission: string; icon: string }[] = [];
    for (var num = 0; num < room_info.chat_member.length; num++) {
      var user = await this.UserRepository.findOne({
        nickname: room_info.chat_member[num].nickname,
      });
      chat_mem.push({
        id: room_info.chat_member[num].nickname,
        permission: room_info.chat_member[num].permission,
        icon: user.icon,
      });
    }
    return { num: num, security: room_info.security, users: chat_mem };
  }

  async addAdmin(title: string, id: string) {
    var room_info = await this.ChatRoomRepository.findOne({ title: title });
    const mem_idx = room_info.chat_member.findIndex(
      (mem) => mem.nickname === id,
    );
    room_info.chat_member[mem_idx].permission = 'admin';
    return await this.ChatRoomRepository.save(room_info);
  }

  async delAdmin(title: string, id: string) {
    var room_info = await this.ChatRoomRepository.findOne({ title: title });
    const mem_idx = room_info.chat_member.findIndex(
      (mem) => mem.nickname === id,
    );
    room_info.chat_member[mem_idx].permission = 'user';
    return await this.ChatRoomRepository.save(room_info);
  }

  async addBan(title: string, id: string) {
    var chat_info = await this.ChatRoomRepository.findOne({ title: title });
    const ban_time_ms: number = 1000 * 60 * 60 * 24 * 3;
    const date: Date = new Date();
    chat_info.chat_banned.push({ nickname: id, date: date });
    setTimeout(() => {
      this.unBan(title, id);
    }, ban_time_ms);
    this.kick(title, id);
    return await this.ChatRoomRepository.save(chat_info);
  }

  async unBan(title: string, id: string) {
    var chat_info = await this.ChatRoomRepository.findOne({ title: title });
    for (let i = 0; i < chat_info.chat_banned.length; i++) {
      if (chat_info.chat_banned[i].nickname === id) {
        chat_info.chat_banned.splice(i, 1);
        break;
      }
    }
    return await this.ChatRoomRepository.save(chat_info);
  }

  async banList(title: string, id: string) {
    const chat_info = await this.ChatRoomRepository.findOne({ title: title });
    const banned: string[] = [];

    for (let i = 0; i < chat_info.chat_banned.length; i++) {
      banned.push(chat_info.chat_banned[i].nickname);
    }
    return banned;
  }

  async kick(title: string, id: string) {
    var chat_info = await this.ChatRoomRepository.findOne({ title: title });
    var user_info = await this.UserRepository.findOne({ nickname: id });
    const user_idx = chat_info.chat_member.findIndex(
      (user) => user.nickname === id,
    );
    const chat_idx = user_info.chat_room.findIndex((chat) => chat === title);
    if (user_idx > -1) chat_info.chat_member.splice(user_idx, 1);
    if (chat_idx > -1) user_info.chat_room.splice(chat_idx, 1);
    await this.ChatRoomRepository.save(chat_info);
    return await this.UserRepository.save(user_info);
  }

  async pwdChange(title, password) {
    var chat_info = await this.ChatRoomRepository.findOne({ title: title });
	if (password !== '')
		chat_info.security = 'protected'
	else
		chat_info.security = 'public'
    chat_info.password = md5(password);
    return await this.ChatRoomRepository.save(chat_info);
  }

  async saveChatLog(title, id, date, content, sysMsg) {
    var chat_info = await this.ChatRoomRepository.findOne({ title: title });
    if (chat_info) {
      chat_info.messages.push({
        nickname: id,
        msg: content,
        date: date,
        sysMsg: sysMsg,
      });
      await this.ChatRoomRepository.save(chat_info);

      const user_info = await this.UserRepository.findOne({ nickname: id });
      return user_info.icon;
    }
  }

  async getChatLog(title) {
    let chat_info = await this.ChatRoomRepository.findOne({ title: title });
    let res: {}[] = [];
    for (let i = 0; i < chat_info.messages.length; i++) {
      const user = await this.UserRepository.findOne({
        nickname: chat_info.messages[i].nickname,
      });
      if (chat_info.messages[i].sysMsg) {
        res.push({
          id: chat_info.messages[i].nickname,
          date: '',
          content: chat_info.messages[i].msg,
          icon: '',
          sysMsg: true,
        });
      } else {
        res.push({
          id: chat_info.messages[i].nickname,
          date: chat_info.messages[i].date,
          content: chat_info.messages[i].msg,
          icon: user.icon,
          sysMsg: false,
        });
      }
    }
    return res;
  }

  async getMute(title, id) {
    const chat_info = await this.ChatRoomRepository.findOne({ title: title });
    const user = chat_info.chat_member.find((mem) => mem.nickname === id);
    if (user.permission === 'muted') {
      return { isMuted: true };
    }
    else return { isMuted: false };
  }

  async putMute(title, id, isMuted) {
    const chat_info = await this.ChatRoomRepository.findOne({ title: title });
    const mute_time_ms = 1000 * 60 * 60 * 24 * 3;
    for (let i = 0; i < chat_info.chat_member.length; i++) {
      if (chat_info.chat_member[i].nickname === id) {
        if (isMuted && chat_info.chat_member[i].permission === 'user') {
          chat_info.chat_member[i].permission = 'muted';
          setTimeout(() => {
            this.putMute(title, id, 0);
          }, mute_time_ms);
          chat_info.messages.push({
            nickname: id,
            msg: '님의 채팅이 금지되었습니다.',
            date: null,
            sysMsg: true,
          });
        } else if (
          !isMuted &&
          chat_info.chat_member[i].permission === 'muted'
        ) {
          chat_info.chat_member[i].permission = 'user';
          chat_info.messages.push({
            nickname: id,
            msg: '님의 채팅금지가 해제되었습니다.',
            date: null,
            sysMsg: true,
          });
        }
        break;
      }
    }
    return await this.ChatRoomRepository.save(chat_info);
  }

  // behind functions for develop
  async getAll() {
    return this.ChatRoomRepository.find();
  }

  async clear() {
    return await this.ChatRoomRepository.clear();
  }
}
