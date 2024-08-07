import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): 'pong' {
    return 'pong';
  }
}
