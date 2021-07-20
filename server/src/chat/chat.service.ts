import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm/index';
import {chat_room} from '../Entity/ChatRoom.entity'
import {ft_user} from '../Entity/User.entity'


@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(chat_room) private readonly ChatRoomRepository: Repository<chat_room>,
		@InjectRepository(ft_user) private readonly UserRepository: Repository<ft_user>
	){}

	async getChatRoomInfo(title:string){
		const room_info =  await this.ChatRoomRepository.findOne({title:title})
		var chat_mem: {id:string, permission:string, icon:string}[] = []
		for(var num = 0;num < room_info.chat_member.length; num++)
		{
			var user = await this.UserRepository.findOne({nickname:room_info.chat_member[num].nickname})
			chat_mem.push({id:room_info.chat_member[num].nickname, permission:room_info.chat_member[num].permission, icon:user.icon})
		}
		return {num:num, security:room_info.security, users:chat_mem}
	}

	async addAdmin(title:string, id:string)
	{
		var room_info = await this.ChatRoomRepository.findOne({title:title})
		const mem_idx = room_info.chat_member.findIndex(mem => mem.nickname === id)
		room_info.chat_member[mem_idx].permission = 'admin'
		return await this.ChatRoomRepository.save(room_info)
	}

	async delAdmin(title:string, id:string)
	{
		var room_info = await this.ChatRoomRepository.findOne({title:title})
		const mem_idx = room_info.chat_member.findIndex(mem => mem.nickname === id)
		room_info.chat_member[mem_idx].permission = 'user'
		return await this.ChatRoomRepository.save(room_info)
	}

	async addBan(title:string, id:string)
	{
		var chat_info = await this.ChatRoomRepository.findOne({title:title})
		const date = new Date()
		chat_info.chat_banned.push({nickname:id, date})
		this.kick(title, id)
		return await this.ChatRoomRepository.save(chat_info)
	}

	async unBan(title:string, id:string)
	{
		var chat_info = await this.ChatRoomRepository.findOne({title:title})
		for(let i = 0; i < chat_info.chat_banned.length; i++)
		{
			if (chat_info.chat_banned[i].nickname === id)
			{
				chat_info.chat_banned.splice(i, 1)
				break
			}
		}
		return await this.ChatRoomRepository.save(chat_info)
	}

	async banList(title:string, id:string)
	{
		const chat_info = await this.ChatRoomRepository.findOne({title:title})
		var banned: string[] = []
		for(let i = 0; i < chat_info.chat_banned.length; i++)
			banned.push(chat_info.chat_banned[i].nickname)
		return banned;
	}

	async kick(title:string, id:string)
	{
		var chat_info = await this.ChatRoomRepository.findOne({title:title})
		var user_info = await this.UserRepository.findOne({nickname:id})
		const user_idx = chat_info.chat_member.findIndex(user => user.nickname === id)
		const chat_idx = user_info.chat_room_list.findIndex(chat => chat === title)
		if (user_idx > -1) chat_info.chat_member.splice(user_idx, 1)
		if (chat_idx > -1) user_info.chat_room_list.splice(chat_idx, 1)
		await this.ChatRoomRepository.save(chat_info)
		return await this.UserRepository.save(user_info)
	}

	async pwdChange(title, password){
		var chat_info = await this.ChatRoomRepository.findOne({title:title})
		chat_info.password = password
		return await this.ChatRoomRepository.save(chat_info)
	}

	async saveChatLog(title, id, date, content){
		var chat_info = await this.ChatRoomRepository.findOne({title:title})
		if (chat_info)
		{
			chat_info.messages.push({
			nickname: id,
			msg: content,
			date: date
			})
			await this.ChatRoomRepository.save(chat_info)
	
			const user_info = await this.UserRepository.findOne({nickname:id})
			return user_info.icon
		}
	}
}
