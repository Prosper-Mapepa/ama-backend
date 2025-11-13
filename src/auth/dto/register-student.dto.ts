import { IsString, IsNotEmpty, IsEmail, MinLength, Matches, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { Major } from '../../students/enums/major.enum';
import { AcademicYear } from '../../students/enums/year.enum';

export class RegisterStudentDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  password: string;

  @IsEnum(Major)
  major: Major;

  @IsEnum(AcademicYear)
  year: AcademicYear;

  @IsBoolean()
  @IsOptional()
  agreedToTerms: boolean = true;
} 