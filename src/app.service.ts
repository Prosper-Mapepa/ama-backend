import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Student Talent Hub API is running!',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}
