import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import {ft_user} from '../Entity/User.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([ft_user])],
	controllers: [AdminController],
	providers: [AdminService]
})
export class AdminModule {}
