import { Controller, Get, UseGuards, Redirect } from '@nestjs/common';
import { FtAuthGuard } from 'src/passport/ft-auth.guard';
const redirect_url = `https://api.intra.42.fr/oauth/authorize?client_id=bdfe71f0d292f9a780b44094736aaf3f844a65813080ff82b60e00bb29143d01&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flog%2Fin&response_type=code`;

@Controller('log')
export class LogInOutController {
  @Get('in')
  @UseGuards(FtAuthGuard)
  async login() {
    return 'logined';
  }

  @Get('auth')
  @Redirect(redirect_url, 301)
  async auth() {
    return 'auth';
  }

  // below apis are for test
}
