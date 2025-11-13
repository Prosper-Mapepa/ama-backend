import { IsString, IsNotEmpty, IsEmail, MinLength, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { BusinessType } from '../../businesses/enums/business-type.enum';

export class RegisterBusinessDto {
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(BusinessType)
  businessType: BusinessType;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsBoolean()
  @IsOptional()
  agreedToTerms: boolean = true;
} 