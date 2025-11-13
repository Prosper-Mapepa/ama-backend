import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAchievementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString({ each: true })
  files?: string[];
} 