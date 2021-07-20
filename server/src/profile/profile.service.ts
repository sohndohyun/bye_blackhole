import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/index';
import { InjectRepository } from '@nestjs/typeorm'
import {ft_user} from '../Entity/User.entity'
import { match_history } from 'src/Entity/MatchHistory.entity';

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(ft_user) private readonly UserRepository: Repository<ft_user>,
		@InjectRepository(match_history) private readonly MatchHistoryRepository: Repository<match_history>
	){}

	async getProfile(myID, otherID){
		const history = [{win:true, id:'jinkim'}, {win:true, id:'taekkim'}, {win:false, id:'jachoi'}, {win:false, id:'dsohn'}]
		const win = 2
		const lose = 2
		if (myID === otherID)
		{
			return ({history:history, win:win, lose:lose})
		}
		else
		{
			const info = await this.UserRepository.findOne({nickname:myID})
			var isF = false;
			var isB = false;
			info.friend_list?.map(friend => {
				if (friend === otherID)
					isF = true
			})
			info.block_list?.map(block => {
				if (block === otherID)
					isB = true
			})
			return ({history:history, win:win, lose:lose, friend:isF, block:isB})
		}
	}

	async IsFriend(myID:string, otherID:string, isFriend:boolean){
		var my_info = await this.UserRepository.findOne({nickname:myID})
		const idx = my_info.friend_list.indexOf(otherID)
		if(isFriend && idx <= -1)
			my_info.friend_list.push(otherID)
		else if (!isFriend && idx > -1)
			my_info.friend_list.splice(idx, 1)
		return await this.UserRepository.save(my_info)
	}

	async IsBlock(myID:string, otherID:string, isBlock:boolean){
		var my_info = await this.UserRepository.findOne({nickname:myID})
		const idx = my_info.block_list.indexOf(otherID)
		if(isBlock && idx <= -1)
			my_info.block_list.push(otherID)
		else if (!isBlock && idx > -1)
			my_info.block_list.splice(idx, 1)
		return await this.UserRepository.save(my_info)
	}
}
