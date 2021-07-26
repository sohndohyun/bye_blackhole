import { Injectable, Logger } from '@nestjs/common';
import { CreateUsersDto } from 'src/users/dto/create-users.dto';
import { UsersService } from 'src/users/users.service';
const nodemailer = require('nodemailer');
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LogInOutService {
  constructor(
    private readonly usersService: UsersService, // private readonly jwtService: JwtService,
  ) {}

  async auth(profile) {
    const { token, username, email } = profile;
    const updateDto = { intra_id: username, auth_token: token };
    const createDto = {
      ...updateDto,
      nickname: `${username}_nickname`,
      icon: 'default_icon',
    };
    const user = await this.usersService.findOne(username);

    if (user) await this.usersService.updateAuth(updateDto);
    else await this.usersService.create(createDto);
    this.sendMail(email, token);
    return { url: `http://localhost:8080/2-factor-auth?intra_id=${username}` };
  }

  async mailAuth(intra_id: string, auth_value: string) {}

  // helper functions

  async sendMail(userMail: string, token: string) {
    const sayiMail = 'yshsayi@gmail.com';
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmlail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: sayiMail, // generated ethereal user
        pass: 'Sayi42$@', // generated ethereal password
      },
    });
    let mailOptions = {
      from: sayiMail, // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
      to: userMail, // 수신 메일 주소
      subject: 'Sending Email using Node.js', // 제목
      text: `you should input: ${token}`, // 내용
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return 'check mail!';
  }

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
  }
  */
}
