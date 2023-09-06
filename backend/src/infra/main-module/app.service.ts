import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Pokedex v1 - Gustavo Torregrosa';
  }
}
