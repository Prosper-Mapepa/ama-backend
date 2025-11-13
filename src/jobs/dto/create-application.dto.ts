import { IsString, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  jobId: string;
} 