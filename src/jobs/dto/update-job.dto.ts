import { IsString, IsOptional, IsEnum } from 'class-validator';
import { JobType } from '../enums/job-type.enum';
import { ExperienceLevel } from '../enums/experience-level.enum';

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  salary?: string;
} 