import { Controller, Get, Post, Body, Param, Patch, Delete, UsePipes, ValidationPipe, Res, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam, 
  ApiBadRequestResponse, 
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Response } from 'express';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';

@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Authentication required',
  schema: {
    example: {
      success: false,
      message: 'Unauthorized - Authentication required'
    }
  }
})
@ApiForbiddenResponse({
  description: 'Insufficient permissions',
  schema: {
    example: {
      success: false,
      message: 'Forbidden - Insufficient permissions'
    }
  }
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Create new user',
    description: 'Create a new user account (typically used internally by auth system)'
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User creation data',
    examples: {
      student: {
        summary: 'Student User',
        value: {
          email: 'student@example.com',
          password: 'SecurePass123!',
          role: 'student',
          agreedToTerms: true
        }
      },
      business: {
        summary: 'Business User',
        value: {
          email: 'business@example.com',
          password: 'SecurePass123!',
          role: 'business',
          agreedToTerms: true
        }
      },
      admin: {
        summary: 'Admin User',
        value: {
          email: 'admin@example.com',
          password: 'SecurePass123!',
          role: 'admin',
          agreedToTerms: true
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserResponseDto,
    schema: {
      example: {
        id: 'uuid',
        email: 'student@example.com',
        role: 'student',
        status: 'active',
        emailVerified: false,
        agreedToTerms: true,
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z'
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
          role: ['Role must be a valid enum value']
        }
      }
    }
  })
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.usersService.create(createUserDto);
    const { password, ...result } = user;
    res.locals.message = 'User created successfully';
    return res.json({ data: result });
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Retrieve a list of all users in the system (admin only)'
  })
  @ApiOkResponse({
    description: 'List of users retrieved successfully',
    type: [UserResponseDto],
    schema: {
      example: [
        {
          id: 'uuid-1',
          email: 'student@example.com',
          role: 'student',
          status: 'active',
          emailVerified: false,
          agreedToTerms: true,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z'
        },
        {
          id: 'uuid-2',
          email: 'business@example.com',
          role: 'business',
          status: 'active',
          emailVerified: true,
          agreedToTerms: true,
          createdAt: '2024-01-14T15:45:00.000Z',
          updatedAt: '2024-01-14T15:45:00.000Z'
        }
      ]
    }
  })
  async findAll(@Res() res: Response) {
    const users = await this.usersService.findAll();
    const data = users.map(({ password, ...rest }) => rest as UserResponseDto);
    res.locals.message = 'Users retrieved successfully';
    return res.json({ data });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their unique identifier'
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: 'uuid'
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: UserResponseDto,
    schema: {
      example: {
        id: 'uuid',
        email: 'student@example.com',
        role: 'student',
        status: 'active',
        emailVerified: false,
        agreedToTerms: true,
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        success: false,
        message: 'User not found'
      }
    }
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException({ message: 'User not found', errors: { id: ['User does not exist'] } });
    }
    const { password, ...result } = user;
    res.locals.message = 'User retrieved successfully';
    return res.json({ data: result });
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Update user',
    description: 'Update user information by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: 'uuid'
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User update data',
    examples: {
      updateEmail: {
        summary: 'Update Email',
        value: {
          email: 'newemail@example.com'
        }
      },
      updatePassword: {
        summary: 'Update Password',
        value: {
          password: 'NewSecurePass123!'
        }
      },
      updateStatus: {
        summary: 'Update Status',
        value: {
          status: 'suspended'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponseDto,
    schema: {
      example: {
        id: 'uuid',
        email: 'newemail@example.com',
        role: 'student',
        status: 'active',
        emailVerified: false,
        agreedToTerms: true,
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T11:45:00.000Z'
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
          password: ['Password must be at least 8 characters long']
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        success: false,
        message: 'User not found'
      }
    }
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    const user = await this.usersService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException({ message: 'User not found', errors: { id: ['User does not exist'] } });
    }
    const { password, ...result } = user;
    res.locals.message = 'User updated successfully';
    return res.json({ data: result });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Delete user',
    description: 'Permanently delete a user account by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: 'uuid'
  })
  @ApiNoContentResponse({
    description: 'User deleted successfully'
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        success: false,
        message: 'User not found'
      }
    }
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException({ message: 'User not found', errors: { id: ['User does not exist'] } });
    }
    await this.usersService.remove(id);
    res.locals.message = 'User deleted successfully';
    return res.json({ data: null });
  }
} 