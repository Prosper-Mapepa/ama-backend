import { Controller, Get, Post, Body, Param, Patch, Delete, UsePipes, ValidationPipe, Res, NotFoundException, UseGuards } from '@nestjs/common';
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
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Response } from 'express';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Businesses')
@Controller('businesses')
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
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Create new business',
    description: 'Create a new business profile with company information'
  })
  @ApiBody({
    type: CreateBusinessDto,
    description: 'Business creation data',
    examples: {
      techCompany: {
        summary: 'Technology Company',
        value: {
          businessName: 'TechCorp Solutions',
          email: 'contact@techcorp.com',
          password: 'SecurePass123!',
          businessType: 'TECHNOLOGY',
          location: 'San Francisco, CA'
        }
      },
      consulting: {
        summary: 'Consulting Firm',
        value: {
          businessName: 'Global Consulting Group',
          email: 'info@globalconsulting.com',
          password: 'SecurePass123!',
          businessType: 'CONSULTING',
          location: 'New York, NY'
        }
      },
      healthcare: {
        summary: 'Healthcare Organization',
        value: {
          businessName: 'HealthFirst Medical Center',
          email: 'hr@healthfirst.com',
          password: 'SecurePass123!',
          businessType: 'HEALTHCARE',
          location: 'Boston, MA'
        }
      },
      finance: {
        summary: 'Financial Institution',
        value: {
          businessName: 'Capital Bank',
          email: 'careers@capitalbank.com',
          password: 'SecurePass123!',
          businessType: 'FINANCE',
          location: 'Chicago, IL'
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Business created successfully',
    schema: {
      example: {
        id: 'uuid',
        businessName: 'TechCorp Solutions',
        email: 'contact@techcorp.com',
        businessType: 'TECHNOLOGY',
        location: 'San Francisco, CA',
        user: {
          id: 'user-uuid',
          email: 'contact@techcorp.com',
          role: 'business'
        }
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
          businessName: ['Business name is required'],
          email: ['Email must be a valid email address'],
          password: ['Password must be at least 8 characters long'],
          businessType: ['Business type must be a valid enum value'],
          location: ['Location is required']
        }
      }
    }
  })
  async create(@Body() createBusinessDto: CreateBusinessDto, @Res() res: Response) {
    const result = await this.businessesService.create(createBusinessDto);
    res.locals.message = 'Business created successfully';
    return res.json({ data: result });
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  @ApiOperation({ 
    summary: 'Get all businesses',
    description: 'Retrieve a list of all businesses with their profiles'
  })
  @ApiOkResponse({
    description: 'List of businesses retrieved successfully',
    schema: {
      example: [
        {
          id: 'uuid-1',
          businessName: 'TechCorp Solutions',
          email: 'contact@techcorp.com',
          businessType: 'TECHNOLOGY',
          location: 'San Francisco, CA',
          user: {
            id: 'user-uuid-1',
            email: 'contact@techcorp.com',
            role: 'business'
          }
        },
        {
          id: 'uuid-2',
          businessName: 'Global Consulting Group',
          email: 'info@globalconsulting.com',
          businessType: 'CONSULTING',
          location: 'New York, NY',
          user: {
            id: 'user-uuid-2',
            email: 'info@globalconsulting.com',
            role: 'business'
          }
        },
        {
          id: 'uuid-3',
          businessName: 'HealthFirst Medical Center',
          email: 'hr@healthfirst.com',
          businessType: 'HEALTHCARE',
          location: 'Boston, MA',
          user: {
            id: 'user-uuid-3',
            email: 'hr@healthfirst.com',
            role: 'business'
          }
        }
      ]
    }
  })
  async findAll(@Res() res: Response) {
    const result = await this.businessesService.findAll();
    res.locals.message = 'Businesses retrieved successfully';
    return res.json({ data: result });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.BUSINESS, UserRole.STUDENT)
  @ApiOperation({ 
    summary: 'Get business by ID',
    description: 'Retrieve a specific business profile by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Business unique identifier',
    example: 'uuid'
  })
  @ApiOkResponse({
    description: 'Business retrieved successfully',
    schema: {
      example: {
        id: 'uuid',
        businessName: 'TechCorp Solutions',
        email: 'contact@techcorp.com',
        businessType: 'TECHNOLOGY',
        location: 'San Francisco, CA',
        user: {
          id: 'user-uuid',
          email: 'contact@techcorp.com',
          role: 'business'
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Business not found',
    schema: {
      example: {
        success: false,
        message: 'Business not found'
      }
    }
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.businessesService.findOne(id);
    if (!result) {
      throw new NotFoundException({ message: 'Business not found', errors: { id: ['Business does not exist'] } });
    }
    res.locals.message = 'Business retrieved successfully';
    return res.json({ data: result });
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
  @ApiOperation({ 
    summary: 'Update business',
    description: 'Update business profile information'
  })
  @ApiParam({
    name: 'id',
    description: 'Business unique identifier',
    example: 'uuid'
  })
  @ApiBody({
    type: UpdateBusinessDto,
    description: 'Business update data',
    examples: {
      updateName: {
        summary: 'Update Business Name',
        value: {
          businessName: 'TechCorp Solutions Inc.'
        }
      },
      updateEmail: {
        summary: 'Update Email',
        value: {
          email: 'newcontact@techcorp.com'
        }
      },
      updateLocation: {
        summary: 'Update Location',
        value: {
          location: 'Austin, TX'
        }
      },
      updateType: {
        summary: 'Update Business Type',
        value: {
          businessType: 'CONSULTING'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Business updated successfully',
    schema: {
      example: {
        id: 'uuid',
        businessName: 'TechCorp Solutions Inc.',
        email: 'contact@techcorp.com',
        businessType: 'TECHNOLOGY',
        location: 'San Francisco, CA',
        user: {
          id: 'user-uuid',
          email: 'contact@techcorp.com',
          role: 'business'
        }
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
          businessName: ['Business name is required'],
          email: ['Email must be a valid email address'],
          businessType: ['Business type must be a valid enum value']
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Business not found',
    schema: {
      example: {
        success: false,
        message: 'Business not found'
      }
    }
  })
  async update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto, @Res() res: Response) {
    const result = await this.businessesService.update(id, updateBusinessDto);
    if (!result) {
      throw new NotFoundException({ message: 'Business not found', errors: { id: ['Business does not exist'] } });
    }
    res.locals.message = 'Business updated successfully';
    return res.json({ data: result });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Delete business',
    description: 'Permanently delete a business profile'
  })
  @ApiParam({
    name: 'id',
    description: 'Business unique identifier',
    example: 'uuid'
  })
  @ApiNoContentResponse({
    description: 'Business deleted successfully'
  })
  @ApiNotFoundResponse({
    description: 'Business not found',
    schema: {
      example: {
        success: false,
        message: 'Business not found'
      }
    }
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const business = await this.businessesService.findOne(id);
    if (!business) {
      throw new NotFoundException({ message: 'Business not found', errors: { id: ['Business does not exist'] } });
    }
    await this.businessesService.remove(id);
    res.locals.message = 'Business deleted successfully';
    return res.json({ data: null });
  }
} 