import { Controller, Post, Body, UsePipes, ValidationPipe, Res } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBadRequestResponse, 
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiCreatedResponse
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { RegisterBusinessDto } from './dto/register-business.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Response } from 'express';
import { Public } from './decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user with email and password to receive JWT token'
  })
  @ApiBody({
    type: LoginDto,
    description: 'Login credentials',
    examples: {
      student: {
        summary: 'Student Login',
        value: {
          email: 'student@example.com',
          password: 'SecurePass123!'
        }
      },
      business: {
        summary: 'Business Login',
        value: {
          email: 'business@example.com',
          password: 'SecurePass123!'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
    schema: {
      example: {
        success: true,
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 'uuid',
            email: 'user@example.com',
            role: 'student',
            status: 'active'
          }
        },
        message: 'Login successful'
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials or validation error',
    schema: {
      example: {
        success: false,
        message: 'Invalid email or password',
        errors: {
          email: ['Email must be a valid email address'],
          password: ['Password must be at least 8 characters long']
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication failed',
    schema: {
      example: {
        success: false,
        message: 'Invalid credentials'
      }
    }
  })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto);
    res.locals.message = 'Login successful';
    return res.json(result);
  }

  @Post('register-student')
  @Public()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ 
    summary: 'Register new student',
    description: 'Create a new student account with profile information'
  })
  @ApiBody({
    type: RegisterStudentDto,
    description: 'Student registration data',
    examples: {
      computerScience: {
        summary: 'Computer Science Student',
        value: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@university.edu',
          password: 'SecurePass123!',
          major: 'COMPUTER_SCIENCE',
          year: 'SENIOR',
          agreedToTerms: true
        }
      },
      business: {
        summary: 'Business Student',
        value: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@university.edu',
          password: 'SecurePass123!',
          major: 'BUSINESS_ADMINISTRATION',
          year: 'JUNIOR',
          agreedToTerms: true
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Student registered successfully',
    type: AuthResponseDto,
    schema: {
      example: {
        success: true,
        data: {
          user: {
            id: 'uuid',
            email: 'john.doe@university.edu',
            role: 'student',
            status: 'active'
          },
          student: {
            id: 'uuid',
            firstName: 'John',
            lastName: 'Doe',
            major: 'COMPUTER_SCIENCE',
            year: 'SENIOR'
          }
        },
        message: 'Student registered successfully'
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Validation error or invalid data',
    schema: {
      example: {
        success: false,
        message: 'Validation failed',
        errors: {
          email: ['Email must be a valid email address'],
          password: ['Password must be at least 8 characters long'],
          major: ['Major must be a valid enum value']
        }
      }
    }
  })
  @ApiConflictResponse({
    description: 'Email already exists',
    schema: {
      example: {
        success: false,
        message: 'Email already registered'
      }
    }
  })
  async registerStudent(@Body() dto: RegisterStudentDto, @Res() res: Response) {
    const result = await this.authService.registerStudent(dto);
    res.locals.message = 'Student registered successfully';
    return res.json(result);
  }

  @Post('register-business')
  @Public()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ 
    summary: 'Register new business',
    description: 'Create a new business account with company information'
  })
  @ApiBody({
    type: RegisterBusinessDto,
    description: 'Business registration data',
    examples: {
      techCompany: {
        summary: 'Technology Company',
        value: {
          businessName: 'TechCorp Solutions',
          email: 'contact@techcorp.com',
          password: 'SecurePass123!',
          businessType: 'TECHNOLOGY',
          location: 'San Francisco, CA',
          agreedToTerms: true
        }
      },
      consulting: {
        summary: 'Consulting Firm',
        value: {
          businessName: 'Global Consulting Group',
          email: 'info@globalconsulting.com',
          password: 'SecurePass123!',
          businessType: 'CONSULTING',
          location: 'New York, NY',
          agreedToTerms: true
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Business registered successfully',
    type: AuthResponseDto,
    schema: {
      example: {
        success: true,
        data: {
          user: {
            id: 'uuid',
            email: 'contact@techcorp.com',
            role: 'business',
            status: 'active'
          },
          business: {
            id: 'uuid',
            businessName: 'TechCorp Solutions',
            businessType: 'TECHNOLOGY',
            location: 'San Francisco, CA'
          }
        },
        message: 'Business registered successfully'
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Validation error or invalid data',
    schema: {
      example: {
        success: false,
        message: 'Validation failed',
        errors: {
          email: ['Email must be a valid email address'],
          password: ['Password must be at least 8 characters long'],
          businessType: ['Business type must be a valid enum value']
        }
      }
    }
  })
  @ApiConflictResponse({
    description: 'Email already exists',
    schema: {
      example: {
        success: false,
        message: 'Email already registered'
      }
    }
  })
  async registerBusiness(@Body() dto: RegisterBusinessDto, @Res() res: Response) {
    const result = await this.authService.registerBusiness(dto);
    res.locals.message = 'Business registered successfully';
    return res.json(result);
  }
} 