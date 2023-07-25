import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'message of service!';
  }
}
//inversion Of control
//inversion : đảo ngược