import {
  Controller,
  Get,
  UseGuards,
  Redirect,
  Post,
  Body,
  Request,
  Patch,
} from '@nestjs/common';
import { FtAuthGuard } from 'src/passport/ft-auth.guard';
import { LogInOutService } from './login_out.service';
const redirect_auth_url = `https://api.intra.42.fr/oauth/authorize?client_id=bdfe71f0d292f9a780b44094736aaf3f844a65813080ff82b60e00bb29143d01&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flog%2Fauth&response_type=code`;

@Controller('log')
export class LogInOutController {
  constructor(private readonly logInOutService: LogInOutService) {}

  @Get('in')
  @Redirect(redirect_auth_url, 301)
  async login() {
    return 'logined';
  }

  @Get('auth')
  @UseGuards(FtAuthGuard)
  @Redirect('http://localhost:8080/2-factor-auth', 302)
  async auth(@Request() req) {
    const result = await this.logInOutService.auth(req.user);
    return result;
  }

  @Post('2-factor-auth')
  async mailAuth(@Body() body) {
    const { intra_id, auth_value } = body;
    console.log(auth_value);
    return await this.logInOutService.mailAuth(intra_id, auth_value);
  }

  @Patch(`out`)
  async logout(@Body(`intra_id`) intra_id: string) {
    return await this.logInOutService.logout(intra_id);
  }
  // below apis are for test
}
