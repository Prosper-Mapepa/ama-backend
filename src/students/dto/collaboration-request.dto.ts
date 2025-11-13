import { IsUUID, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CollaborationRequestDto {
  @IsUUID()
  recipientId: string;

  @IsOptional()
  @IsUUID()
  talentId?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

