import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTalentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  category: string;

  @IsString()
  description?: string;
} 