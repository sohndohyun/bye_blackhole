import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { FtStrategy } from 'src/passport/ft-stratege';
// import { JwtService } from '@nestjs/jwt';
import * as FormData from 'form-data';
import * as express from 'express';
const FortyTwoStrategy = require('passport-42').Strategy;
import passport from 'passport';
/* const url = 'https://api.intra.42.fr/oauth/token';
const client_id =
  'bdfe71f0d292f9a780b44094736aaf3f844a65813080ff82b60e00bb29143d01';
const client_secret =
  'b9d5dd431d885957f350bd14a3410514963c1383b2874071399d67cc6345549f'; */
const clientID =
  'bdfe71f0d292f9a780b44094736aaf3f844a65813080ff82b60e00bb29143d01';
const clientSecret =
  'b9d5dd431d885957f350bd14a3410514963c1383b2874071399d67cc6345549f';
const callbackURL = 'http://localhost:8080/log/outh';
@Injectable()
export class LogInOutService {
  constructor(
    private readonly usersService: UsersService, // private readonly jwtService: JwtService,
  ) {}
  /*   async generateToken(id: string, username: string): Promise<string> {
    try {
      const payload = { username, sub: id };
      const token = this.jwtService.sign(payload);
      console.log(token);
      return token;
    } catch (e) {
      console.log(e);
      throw e;
    }
  } */

  // helper functions
}
