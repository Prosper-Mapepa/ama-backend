import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { JobType } from '../enums/job-type.enum';
import { ExperienceLevel } from '../enums/experience-level.enum';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(JobType)
  type: JobType;

  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @IsString()
  @IsNotEmpty()
  businessId: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  salary?: string;
} 