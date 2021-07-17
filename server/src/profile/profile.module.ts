import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import {ft_user} from '../Entity/User.entity'
import {match_history} from '../Entity/MatchHistory.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([ft_user, match_history])],
	controllers: [ProfileController],
	providers: [ProfileService]
})
export class ProfileModule {}
