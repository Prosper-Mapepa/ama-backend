import { Controller, Get, Res } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiOkResponse
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { Response } from 'express';
import { Public } from './auth/decorators/public.decorator';

interface HealthResponse {
  message: string;
  timestamp: string;
  version: string;
}

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiOperation({ 
    summary: 'Health check',
    description: 'Check if the API is running and healthy'
  })
  @ApiOkResponse({
    description: 'API is healthy',
    schema: {
      example: {
        message: 'Student Talent Hub API is running!',
        timestamp: '2024-01-15T10:30:00.000Z',
        version: '1.0.0'
      }
    }
  })
  getHello(@Res() res: Response): void {
    const result = this.appService.getHello();
    res.locals.message = 'API health check successful';
    res.json({ data: result });
  }
}
