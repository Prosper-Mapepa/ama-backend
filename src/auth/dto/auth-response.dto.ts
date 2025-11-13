export class AuthResponseDto<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
} 