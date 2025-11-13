import { IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdateTalentDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;
} 