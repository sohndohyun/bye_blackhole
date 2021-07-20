import { Controller, Get, Param, Delete, Post, Body, Patch} from '@nestjs/common';
import { chat_room } from './roomList.entity';
import { RoomService } from './roomList.service';

@Controller('/RoomList')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Get('/list')
	async find(): Promise<chat_room[]> {
		return await this.roomService.find();
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<chat_room> {
		return await this.roomService.findOne(id);
	}

	@Post()
	async save(@Body() {id, password, owner_id}): Promise<string> {
		await this.roomService.save({id, password, owner_id});
		return 'insert successfully'
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<string> {
		await this.roomService.delete(id);
		return 'delete successfully'
	}

	@Patch('incNum/:id')
	async incNum(@Param('id') id:string): Promise<chat_room>{
		return await this.roomService.incNum(id);
	}
	@Patch('decNum/:id')
	async decNum(@Param('id') id:string): Promise<chat_room>{
		return await this.roomService.decNum(id);
	}
}
