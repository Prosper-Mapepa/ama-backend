import { IsString, IsNotEmpty } from 'class-validator';

export class ConversationDto {
  @IsString()
  @IsNotEmpty()
  userA: string;

  @IsString()
  @IsNotEmpty()
  userB: string;
} 