import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    description: 'Page number (starts from 1)',
    example: 1,
    minimum: 1,
    default: 1,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'Search query for filtering results',
    example: 'developer',
    required: false
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Sort field',
    example: 'createdAt',
    required: false
  })
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    description: 'Sort order (asc or desc)',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'desc',
    required: false
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
} 