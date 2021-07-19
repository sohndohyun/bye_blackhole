import { Controller, Get, Param, Delete, Post, Body, Patch, Put, HttpException, HttpStatus, Query} from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get('')
	async getProfile(@Query('myID') myID:string, @Query('otherID') otherID:string): Promise<{history:{win:boolean, p2:string}[], friend:boolean, block:boolean, win:number, lose:number} | {history:{win:boolean, p2:string}[], win:number, lose:number}> {
		return await this.profileService.getProfile(myID, otherID);
	}

	@Put('/friend')
	async IsFriend(@Body() {myID, otherID, isFriend})
	{
		return await this.profileService.IsFriend(myID, otherID, isFriend)
	}

	@Put('/block')
	async IsBlock(@Body() {myID, otherID, isFriend})
	{
		return await this.profileService.IsBlock(myID, otherID, isFriend)
	}
}
