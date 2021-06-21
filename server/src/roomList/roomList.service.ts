import { Injectable } from '@nestjs/common';
import {chat_room} from './roomList.entity';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm/index';

@Injectable()
export class RoomService {
	constructor(@InjectRepository(chat_room) private readonly ChatRoomRepository: Repository<chat_room>){}

	//select all
	async find(): Promise<chat_room[]> {
		return await this.ChatRoomRepository.find();
	}

	//find one
	async findOne(id: string): Promise<chat_room> {
		return await this.ChatRoomRepository.findOne({id:id})
	}

	//insert
	async save({id, password, owner_id}): Promise<chat_room> {
		return await this.ChatRoomRepository.save({id:id, password:password, owner_id:owner_id, num: 1})
	}

	//delete
	async delete(id:string): Promise<void> {
		await this.ChatRoomRepository.delete({id:id})
	}

	//update room num++
	async incNum(id: string): Promise<chat_room> {
		const value = await this.ChatRoomRepository.findOne({id:id})
		value.num++;
		await this.ChatRoomRepository.save(value)
		return value;
	}
	//update room num--
	async decNum(id: string): Promise<chat_room> {
		const value = await this.ChatRoomRepository.findOne({id:id})
		value.num--;
		await this.ChatRoomRepository.save(value)
		return value;
	}
}
