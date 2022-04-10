import { Injectable } from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';
import { FieldState } from './fieldState.enum';

@Injectable()
export class RandomService {
  getUUID(): string {
    return uuidv4();
  }
  
  getPlayer(): FieldState {
    return Math.floor(Math.random() * 2);
  }
}