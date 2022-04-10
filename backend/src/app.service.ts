import { Injectable } from '@nestjs/common';
import { FieldState } from './fieldState.enum';
import { RandomService } from './random.service';

@Injectable()
export class AppService {
  currentGameId: string

  constructor(private readonly randomService: RandomService) {}

  createGame(): string {
    let newGameId: string
    do {
      newGameId = this.randomService.getUUID();  
    } while (newGameId == this.currentGameId);
    this.currentGameId = newGameId;
    return this.currentGameId;
  }

  getGame(id: string): any {
    return [
      FieldState.Empty, FieldState.Empty, FieldState.Empty,
      FieldState.Empty, FieldState.Empty, FieldState.Empty,
      FieldState.Empty, FieldState.Empty, FieldState.Empty,
      this.randomService.getPlayer()
    ]
  }
}