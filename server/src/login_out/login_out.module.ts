import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LogInOutController } from './login_out.controller';
import { LogInOutService } from './login_out.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { FtStrategy } from 'src/passport/ft-stratege';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from './auth.repository';
// import { JwtStrategy } from '../passport/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    TypeOrmModule.forFeature([UsersRepository, AuthRepository]),
    /*     JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: '7d' },
      }),
    }), */
  ],
  controllers: [LogInOutController],
  providers: [
    UsersService,
    LogInOutService,
    FtStrategy,
    // , JwtStrategy
  ],
})
export class LogInOutModule {}
