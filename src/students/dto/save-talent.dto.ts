import { IsUUID, IsBoolean } from 'class-validator';

export class SaveTalentDto {
  @IsUUID()
  talentId: string;

  @IsBoolean()
  isSaved: boolean;
}

