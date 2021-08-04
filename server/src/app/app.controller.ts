import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { parse } from 'url';
import { join } from 'path';

@Controller('/')
export class AppController {
  @Get('Admin')
  public async RoomList(@Req() req: Request, @Res() res: Response) {
    await res.sendFile(join(__dirname + '/../../../client/build/index.html'));
  }
  @Get('Chat')
  public async Chat(@Req() req: Request, @Res() res: Response) {
    await res.sendFile(join(__dirname + '/../../../client/build/index.html'));
  }
  @Get('Lobby')
  public async Lobby(@Req() req: Request, @Res() res: Response) {
    await res.sendFile(join(__dirname + '/../../../client/build/index.html'));
  }
  @Get('2-factor-auth')
  public async Auth(@Req() req: Request, @Res() res: Response) {
    await res.sendFile(join(__dirname + '/../../../client/build/index.html'));
  }
  @Get('Pong')
  public async Pong(@Req() req: Request, @Res() res: Response) {
    await res.sendFile(join(__dirname + '/../../../client/build/index.html'));
  }
}
