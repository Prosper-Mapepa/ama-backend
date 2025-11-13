import { IsUUID, IsBoolean } from 'class-validator';

export class LikeTalentDto {
  @IsUUID()
  talentId: string;

  @IsBoolean()
  isLiked: boolean;
}

