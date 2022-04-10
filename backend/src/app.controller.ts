import { Controller, Get, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Put()
  createGame(): string {
    return this.appService.createGame();
  }

  @Get()
  getGame(id: string): any {
    return this.appService.getGame(id);
  }
}
