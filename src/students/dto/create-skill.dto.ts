import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Proficiency } from '../enums/proficiency.enum';

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(Proficiency)
  proficiency?: Proficiency;
} 