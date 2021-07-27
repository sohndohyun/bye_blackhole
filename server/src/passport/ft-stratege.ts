import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
// import { User } from '../users/users.repository';
const clientID =
  'bdfe71f0d292f9a780b44094736aaf3f844a65813080ff82b60e00bb29143d01';
const clientSecret =
  'b9d5dd431d885957f350bd14a3410514963c1383b2874071399d67cc6345549f';
const callbackURL = 'http://localhost:8080/log/auth';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID,
      clientSecret,
      callbackURL,
    });
  }
  async validate(token: string, rt: string, profile: any) {
    console.log('🎶');
    try {
      const { username, emails } = profile;
      if (profile._json.cursus_users.length < 2)
        throw new NotAcceptableException();
      const user = {
        token: this.createToken(),
        username,
        email: emails[0].value,
      };
      return user;
    } catch (e) {
      console.log(`🤢 strategy error: `);
      console.log(e);
      throw e;
    }
  }

  createToken() {
    return Math.random().toString(36).substring(2, 6);
  }
}
