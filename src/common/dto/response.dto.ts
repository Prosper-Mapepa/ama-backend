import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T = any> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Response data',
    required: false
  })
  data?: T;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
    required: false
  })
  message?: string;

  @ApiProperty({
    description: 'Error details if the request failed',
    required: false
  })
  errors?: any;

  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2024-01-15T10:30:00.000Z'
  })
  timestamp: string;
}

export class PaginatedResponseDto<T = any> extends ResponseDto<T[]> {
  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false
  })
  hasPrev: boolean;
} 