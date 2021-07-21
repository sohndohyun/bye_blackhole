import { Controller, Get, Post, Body, Patch, Query } from '@nestjs/common';
import { LogInOutService } from './login_out.service';
import { CreateUsersDto } from '../users/dto/create-users.dto';
import { UpdateUsersDto } from '../users/dto/update-users.dto';

@Controller('log')
export class LogInOutController {
  constructor(private readonly logInOutService: LogInOutService) {}

  @Post('in')
  create(@Body() body) {
    // const { intra_id, password } = body;
    // return this.logInOutService.create();
  }

  @Get('in')
  login(@Query('code') code: string) {
    console.log(code);
    return this.logInOutService.login(code);
  }

  @Patch('out')
  update(@Body() updateUserDto) {
    // console.log('update');
    // return this.logInOutService.update(updateUserDto);
  }

  // below apis are for test
}
