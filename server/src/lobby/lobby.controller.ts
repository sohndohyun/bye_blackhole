import { Controller, Get, Param, Delete, Post, Body, Patch, Put, HttpException, HttpStatus, Query} from '@nestjs/common';
import {LobbyService} from './lobby.service'

@Controller('lobby')
export class LobbyController {
	constructor(private readonly lobbyService: LobbyService) {}

	@Get('/chatList')
	async getChatList(): Promise<{title:string, num:number, security:string}[]> {
		return await this.lobbyService.getChatList();
	}

	@Get('/gameList')
	async getGameList(): Promise<{p1:string, p2:string, speed:boolean, ladder:boolean}[]> {
		return await this.lobbyService.getGameList();
	}

	@Post('chatCreate')
	async createChatRoom(@Body() {title, password, security, owner_id}): Promise<string> {
		var rtn = await this.lobbyService.createChatRoom(title, password, security, owner_id)
		if (!rtn)
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
		return 'chat Room Create successfully'
	}

	@Post('/gameCreate')
	async createGameRoom(@Body() {id, speed, ladder}): Promise<string> {
		var rtn = await this.lobbyService.createGameRoom(id, speed, ladder)
		if (!rtn)
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
		return 'matching successfully'
	}


	@Get('userList')
	async getUserList(@Query('id') id:string): Promise<{id:string, icon:string, state:string, isFriend:boolean}[]>{
		return await this.lobbyService.getUserList(id);
	}

	@Get('myChatList')
	async getMyChatList(@Query('id') id:string): Promise<{title:string, num: number}[]>{
		return await this.lobbyService.getMyChatList(id);
	}


	@Post('enter')
	async enterChatRoom(@Body() {title, id, password})
	{
		const rtn = await this.lobbyService.enterChatRoom(title, id, password)
		if (rtn)
			return 'Enter successfully'
		else
			throw new HttpException('unauthorization', HttpStatus.UNAUTHORIZED)
	}

	@Delete('')
	async deleteMyChat(@Query('title') title:string, @Query('id') id:string){
		return await this.lobbyService.deleteMyChat(title, id)
	}
}
