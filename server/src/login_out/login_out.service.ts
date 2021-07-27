import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthRepository } from './auth.repository';
const nodemailer = require('nodemailer');
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LogInOutService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersService: UsersService, // private readonly jwtService: JwtService,
  ) {}

  async auth(profile) {
    const { token, username, email } = profile;
    const auth = { intra_id: username, auth_token: token };
    const isExist = await this.authRepository.findOne(username);

    if (isExist) await this.authRepository.update(username, auth);
    else await this.authRepository.save(auth);
    this.sendMail(email, token);
    return { url: `http://localhost:8080/2-factor-auth?intra_id=${username}` };
  }

  async mailAuth(intra_id: string, auth_value: string) {
    let user = await this.usersService.findOne(intra_id);
    const auth = await this.authRepository.findOne(intra_id);
    const auth_result = auth ? auth.auth_token === auth_value : false;
    const nickname = user ? user.nickname : '';

	//login
	if (nickname)
	{
		await this.usersService.updateAuth({
			intra_id,
			state: 'on',
		});
	}

    if (auth_result) await this.authRepository.delete(intra_id);
    return { id: nickname, auth_result };
  }

  async logout(intra_id: string) {
	  console.log('logout!!!!')
    return await this.usersService.updateAuth({
      intra_id,
      state: 'off',
    });
  }

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
