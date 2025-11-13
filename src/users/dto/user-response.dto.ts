import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class UserResponseDto {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  agreedToTerms: boolean;
  createdAt: Date;
  updatedAt: Date;
} 