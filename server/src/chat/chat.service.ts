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

	async getChatRoomInfo(title:string, id:string){
		console.log(title)
		const room_info =  await this.ChatRoomRepository.findOne({title:title})
		for(var num = 0;num < room_info.chat_member.length; num++)
		{
			if (id === room_info.chat_member[num].nickname)
				var myPermission = room_info.chat_member[num].permission
		}
		return {num:num, myPermission:myPermission, security:room_info.security}
	}
}
