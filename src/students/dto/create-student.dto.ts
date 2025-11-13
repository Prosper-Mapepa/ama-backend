import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Major } from '../enums/major.enum';
import { AcademicYear } from '../enums/year.enum';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(Major)
  major: Major;

  @IsEnum(AcademicYear)
  year: AcademicYear;

  @IsString()
  @IsOptional()
  about?: string;

  @IsOptional()
  profileViews?: number;
} 