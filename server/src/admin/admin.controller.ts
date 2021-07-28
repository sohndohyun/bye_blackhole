import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateUsersDto } from '../users/dto/create-users.dto';
import { UpdateUsersDto } from '../users/dto/update-users.dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createUserDto: CreateUsersDto) {
    // console.log('create');
    return this.adminService.create(createUserDto);
  }

  @Patch()
  update(@Body() updateAdmin) {
    return this.adminService.updateAdmin(updateAdmin);
  }

  // below apis are for test
  @Get('all')
  findAll() {
    // console.log('find all');
    return this.adminService.findAll();
  }

  @Delete('/clear')
  clear() {
    // console.log('clear');
    return this.adminService.clear();
  }

  @Delete(':id')
  remove(@Param('id') nickname: string) {
    // console.log('by id delete');
    return this.adminService.remove(nickname);
  }
}
