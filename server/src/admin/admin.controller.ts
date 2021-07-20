import { Controller, Get, Param, Delete, Post, Body, Patch, Put} from '@nestjs/common';
import {ft_user} from '../Entity/User.entity'
import {AdminService} from './admin.service'

@Controller('/admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Post('')
	async signUp(@Body() {intra_id, icon, nickname}): Promise<string>{
		await this.adminService.saveUser(intra_id, nickname, icon)
		return 'signUp successfully'
	}

	@Patch('')
	async signIn(@Body() {intra_id, icon, nickname}): Promise<string>{
		await this.adminService.saveUser(intra_id, nickname, icon)
		return 'signIn successfully'
	}
}
