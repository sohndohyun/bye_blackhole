import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchHistoryService } from './match_history.service';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchHistoryDto } from './dto/update-match-history.dto';

@Controller('match-history')
export class MatchHistoryController {
  constructor(private readonly matchHistoryService: MatchHistoryService) {}

  @Post()
  async create(@Body() createMatchHistoryDto: CreateMatchHistoryDto) {
    return await this.matchHistoryService.create(createMatchHistoryDto);
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMatchHistoryDto: UpdateMatchHistoryDto,
  ) {
    return this.matchHistoryService.update(+id, updateMatchHistoryDto);
  }

  @Delete()
  async clear() {
    return await this.matchHistoryService.clear();
  }
}
