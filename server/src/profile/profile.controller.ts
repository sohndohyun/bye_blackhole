import { Controller, Get, Param, Delete, Post, Body, Patch, Put, HttpException, HttpStatus} from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get(':myID/:otherID')
	async getProfile(@Param('myID') myID:string, @Param('otherID') otherID:string): Promise<{history:{win:boolean, p2:string}[], friend:boolean, block:boolean, win:number, lose:number} | {history:{win:boolean, p2:string}[], win:number, lose:number}> {
		return await this.profileService.getProfile(myID, otherID);
	}
}
