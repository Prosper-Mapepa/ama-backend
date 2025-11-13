import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsBoolean } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsBoolean()
  agreedToTerms: boolean;
} 