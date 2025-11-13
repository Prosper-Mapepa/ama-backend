import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  async getUserStats() {
    // Return mock or real stats as needed
    return { total: 0, active: 0, inactive: 0, suspended: 0 };
  }
}