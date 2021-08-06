import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { MatchHistoryService } from './match_history.service';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';

@Controller('match-history')
export class MatchHistoryController {
  constructor(private readonly matchHistoryService: MatchHistoryService) {}

  @Post()
  async create(@Body() body) {
    return await this.matchHistoryService.create(body);
  }

  // behind method no matter on real service
  @Get('findMatchHistrory')
  async findMatchHistrory() {
    return await this.matchHistoryService.findById('taekim');
  }

  @Get()
  async findAll() {
    return await this.matchHistoryService.findAll();
  }

  @Delete()
  async clear() {
    return await this.matchHistoryService.clear();
  }
}
