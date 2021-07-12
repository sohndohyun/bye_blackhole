import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm/index';
import {ft_user} from '../Entity/User.entity'

@Injectable()
export class AdminService {
	constructor(@InjectRepository(ft_user) private readonly UserRepository: Repository<ft_user>)
	{}

	async saveUser(intra_id, nickname, icon, state): Promise<ft_user> {
		return await this.UserRepository.save({
			intra_id: intra_id,
			nickname: nickname,
			icon: icon,
			state: state
		});
	}
}
