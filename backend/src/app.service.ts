import { BadRequestException, HttpCode, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { FieldState } from './fieldState.enum';
import { RandomService } from './random.service';
import { UpdateGameDto } from './updateGameDto';

@Injectable()
export class AppService {
  games: Map<string, Array<FieldState>>

  constructor(private readonly randomService: RandomService) {
    this.games = new Map<string, Array<FieldState>>();
  }

  createGame(): string {
    let newGameId: string

    do {
      newGameId = this.randomService.getUUID();  
    } while (this.games.has(newGameId));

    this.games.set(
      newGameId,
      [
        FieldState.Empty, FieldState.Empty, FieldState.Empty,
        FieldState.Empty, FieldState.Empty, FieldState.Empty,
        FieldState.Empty, FieldState.Empty, FieldState.Empty,
        this.randomService.getPlayer(),
        FieldState.Empty
      ]
    );

    return newGameId;
  }

  getGame(id: string): Array<FieldState>  {
    this.checkId(id);

    return this.games.get(id);
  }

  updateGame(id: string, updateGameDto: UpdateGameDto): Array<FieldState> {
    this.checkId(id);
    this.checkGameOver(id);
    this.checkPlayer(id, updateGameDto);
    this.checkField(id, updateGameDto);

    this.games.get(id)[updateGameDto.field] = updateGameDto.state;
    this.setNextPlayer(id, updateGameDto);
    this.setWinner(id, updateGameDto);
    
    return this.games.get(id);
  }

  private checkId(id: string): void {
    if (!this.games.has(id)) {
      throw new NotFoundException();
    }
  }

  private checkGameOver(id: string): void {
    if (this.games.get(id)[10] != FieldState.Empty) {
      throw new BadRequestException();
    }
  }

  private checkPlayer(id: string, updateGameDto: UpdateGameDto): void {
    if (this.games.get(id)[9] != updateGameDto.state) {
      throw new BadRequestException();
    }
  }

  private checkField(id: string, updateGameDto: UpdateGameDto): void {
    if (updateGameDto.field < 0 || updateGameDto.field > 8) {
      throw new BadRequestException();
    }

    if (this.games.get(id)[updateGameDto.field] != FieldState.Empty) {
      throw new BadRequestException();
    }
  }

  private setNextPlayer(id: string, updateGameDto: UpdateGameDto): void {
    switch (updateGameDto.state) {
      case FieldState.O:
        this.games.get(id)[9] = FieldState.X;
        break;
      case FieldState.X:
        this.games.get(id)[9] = FieldState.O;
        break;
    }
  }

  private setWinner(id: string, updateGameDto: UpdateGameDto): void {
    if (this.isHorizontalWin(id, updateGameDto) ||
        this.isVerticalWin(id, updateGameDto) ||
        this.isDiagonalWin(id, updateGameDto)) {
      this.games.get(id)[10] = updateGameDto.state;
    }
  }

  private isHorizontalWin(id: string, updateGameDto: UpdateGameDto): boolean {
    for (let i = 0; i < 9; i = i + 3) {
      if (this.games.get(id)[i] == updateGameDto.state &&
          this.games.get(id)[i+1] == updateGameDto.state &&
          this.games.get(id)[i+2] == updateGameDto.state) {
        return true;
      }
    }
    return false;
  }

  private isVerticalWin(id: string, updateGameDto: UpdateGameDto): boolean {
    for (let i = 0; i < 3; i++) {
      if (this.games.get(id)[i] == updateGameDto.state &&
          this.games.get(id)[i+3] == updateGameDto.state &&
          this.games.get(id)[i+6] == updateGameDto.state) {
        return true;
      }
    }
    return false;
  }

  private isDiagonalWin(id: string, updateGameDto: UpdateGameDto): boolean {
    return this.isLeftToRightDiagonalWin(id, updateGameDto) || this.isRightToLeftDiagonalWin(id, updateGameDto);
  }

  private isLeftToRightDiagonalWin(id: string, updateGameDto: UpdateGameDto): boolean {
    if (this.games.get(id)[0] == updateGameDto.state &&
        this.games.get(id)[4] == updateGameDto.state &&
        this.games.get(id)[8] == updateGameDto.state) {
      return true;
    }
    return false;
  }

  private isRightToLeftDiagonalWin(id: string, updateGameDto: UpdateGameDto): boolean {
    if (this.games.get(id)[2] == updateGameDto.state &&
        this.games.get(id)[4] == updateGameDto.state &&
        this.games.get(id)[6] == updateGameDto.state) {
      return true;
    }
    return false;
  }
}