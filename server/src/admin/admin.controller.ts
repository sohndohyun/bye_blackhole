import { Controller, Get, Param, Delete, Post, Body, Patch, Put} from '@nestjs/common';
import {ft_user} from '../Entity/User.entity'
import {AdminService} from './admin.service'

@Controller('/admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Put(':intra_id')
	async signUp(@Param('intra_id') intra_id: string, @Body() {nickname, icon, state}): Promise<string>{
		await this.adminService.saveUser(intra_id, nickname, icon, state)
		return 'signUp successfully'
	}
}
