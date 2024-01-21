import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  viewUsers() {
    // Implement the logic to view users
    // This might involve fetching data from a database or another source
    return 'This is the result of viewingsers';
    
  }
}
