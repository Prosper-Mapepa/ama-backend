import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Major } from '../enums/major.enum';
import { AcademicYear } from '../enums/year.enum';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEnum(Major)
  major?: Major;

  @IsOptional()
  @IsEnum(AcademicYear)
  year?: AcademicYear;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  profileViews?: number;
} 