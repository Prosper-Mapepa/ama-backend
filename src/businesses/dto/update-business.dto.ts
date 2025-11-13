import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { BusinessType } from '../enums/business-type.enum';

export class UpdateBusinessDto {
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(BusinessType)
  businessType?: BusinessType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  website?: string;
} 