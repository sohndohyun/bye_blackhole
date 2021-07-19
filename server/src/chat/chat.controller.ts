import { Controller, Get, Param, Delete, Post, Body, Patch, Put, HttpException, HttpStatus, Query} from '@nestjs/common';
import {ChatService} from './chat.service'


@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get('')
	async getChatRoomInfo(@Query('title') title:string, @Query('id') id:string) {
		return await this.chatService.getChatRoomInfo(title, id)
	}
}
