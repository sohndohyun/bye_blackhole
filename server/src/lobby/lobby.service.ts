import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm/index';
import {chat_room} from '../Entity/ChatRoom.entity'
import {game_room} from '../Entity/GameRoom.entity'

@Injectable()
export class LobbyService {
	constructor(
		@InjectRepository(chat_room) private readonly ChatRoomRepository: Repository<chat_room>,
		@InjectRepository(game_room) private readonly GameRoomRepository: Repository<game_room>
	){}

	async getChatList(): Promise<{title:string, num:number, security:string}[]> {
		var data = await this.ChatRoomRepository.find();
		var chatList : Array<{title:string, num:number, security:string}> = []

		data?.map(chatRoom => {
			chatList.push({title:chatRoom.title, num:chatRoom.chat_member.length, security:chatRoom.security})
		})

		return chatList
	}

	async getGameList(): Promise<{p1:string, p2:string, speed:boolean, ladder:boolean}[]> {
		var data = await this.GameRoomRepository.find();
		var chatList : Array<{p1:string, p2:string, speed:boolean, ladder:boolean}> = []

		data?.map(chatRoom => {
			chatList.push({p1:chatRoom.p1, p2:chatRoom.p2, speed:chatRoom.speed, ladder:chatRoom.ladder})
		})

		return chatList
	}

	async createChatRoom(title, password, security, owner_id): Promise<chat_room> {
		var rtn = await this.ChatRoomRepository.findOne(title)
		if (!rtn){
			return await this.ChatRoomRepository.save({
				title: title, 
				password: password,
				security: security,
				chat_member: [{nickname: owner_id, permission: 'owner'}], 
				messages: []
			})
		}
		else return null
	}

	async createGameRoom(nickname, speed, ladder): Promise<game_room> {
		//매칭 중에는 userState(matching으로 변경)
		//매칭 안되면 null 리턴
		
		return await this.GameRoomRepository.save({
			p1: nickname,
			p2: 'p2',
			speed: speed,
			ladder: ladder
		})
	}
}
