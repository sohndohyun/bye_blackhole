import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Put,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('info')
  async getChatRoomInfo(@Query('title') title: string) {
    return await this.chatService.getChatRoomInfo(title);
  }

  @Get('admin')
  async addAdmin(@Query('title') title: string, @Query('id') id: string) {
    return await this.chatService.addAdmin(title, id);
  }

  @Delete('admin')
  async delAdmin(@Query('title') title: string, @Query('id') id: string) {
    return await this.chatService.delAdmin(title, id);
  }

  @Get('ban')
  async addBan(@Query('title') title: string, @Query('id') id: string) {
    return await this.chatService.addBan(title, id);
  }

  @Get('unban')
  async unBan(@Query('title') title: string, @Query('id') id: string) {
    return await this.chatService.unBan(title, id);
  }

  @Get('banList')
  async banList(@Query('title') title: string, @Query('id') id: string) {
    return await this.chatService.banList(title, id);
  }

  @Get('kick')
  async kick(@Query('title') title: string, @Query('id') id: string) {
    return await this.chatService.kick(title, id);
  }

  @Post('setting')
  async pwdChange(@Body() { title, password }) {
    return await this.chatService.pwdChange(title, password);
  }

  @Post('chatLog')
  async saveChatLog(@Body() { title, id, date, content, sysMsg }) {
    return await this.chatService.saveChatLog(title, id, date, content, sysMsg);
  }

  @Get('chatLog')
  async getChatLog(@Query('title') title: string) {
    return await this.chatService.getChatLog(title);
  }

  @Get('mute')
  async getMute(@Query('title') title: string, @Query('id') id: string) {
    return await this.chatService.getMute(title, id);
  }

  @Put('mute')
  async putMute(@Body() { title, id, isMuted }) {
    return await this.chatService.putMute(title, id, isMuted);
  }

  // behind functions for develop
  @Get('all')
  async getAll() {
    return await this.chatService.getAll();
  }

  @Delete()
  async clear() {
    return await this.chatService.clear();
  }
}
