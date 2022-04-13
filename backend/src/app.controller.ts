import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { FieldState } from './fieldState.enum';
import { UpdateGameDto } from './updateGameDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createGame(): string {
    return this.appService.createGame();
  }

  @Get(':id')
  getGame(@Param('id') id: string): Array<FieldState> {
    return this.appService.getGame(id); 
  }

  @Put(':id')
  updateGame(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto): Array<FieldState> {    
    return this.appService.updateGame(id, updateGameDto); 
  }
}
