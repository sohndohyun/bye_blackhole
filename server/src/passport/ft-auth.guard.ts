import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
const nodemailer = require('nodemailer');

@Injectable()
export class FtAuthGuard extends AuthGuard('42') {
  handleRequest(err, user, info, context: ExecutionContext) {
    console.log(`😎 ft guard`);
    const { token, username, email } = user;
    if (err || !user) {
      const res = context.switchToHttp().getResponse();
      return res.redirect('/outh');
    }
    const res = context.switchToHttp().getResponse();
    this.sendMail(email, token);
    return res.redirect(`/2-factor-auth?intra_id=${username}`);
  }

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
}
