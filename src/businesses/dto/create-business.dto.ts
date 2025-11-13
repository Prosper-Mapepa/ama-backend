import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { BusinessType } from '../enums/business-type.enum';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsEmail()
  email: string;

  @IsEnum(BusinessType)
  businessType: BusinessType;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  website?: string;
} 