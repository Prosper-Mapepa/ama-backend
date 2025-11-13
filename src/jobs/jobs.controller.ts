import { Controller, Get, Post, Body, Param, Patch, Delete, UsePipes, ValidationPipe, Res, NotFoundException, UseGuards, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
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
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Response } from 'express';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Jobs')
@Controller('jobs')
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
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
  @ApiOperation({ 
    summary: 'Create new job posting',
    description: 'Create a new job posting for businesses to hire students'
  })
  @ApiBody({
    type: CreateJobDto,
    description: 'Job creation data',
    examples: {
      softwareDeveloper: {
        summary: 'Software Developer',
        value: {
          title: 'Junior Full Stack Developer',
          description: 'We are looking for a passionate junior developer to join our team',
          type: 'FULL_TIME',
          experienceLevel: 'ENTRY_LEVEL',
          businessId: 'business-uuid'
        }
      },
      intern: {
        summary: 'Internship',
        value: {
          title: 'Marketing Intern',
          description: 'Summer internship opportunity in digital marketing',
          type: 'INTERNSHIP',
          experienceLevel: 'ENTRY_LEVEL',
          businessId: 'business-uuid'
        }
      },
      senior: {
        summary: 'Senior Position',
        value: {
          title: 'Senior Data Scientist',
          description: 'Lead data science initiatives and mentor junior team members',
          type: 'FULL_TIME',
          experienceLevel: 'SENIOR',
          businessId: 'business-uuid'
        }
      },
      partTime: {
        summary: 'Part-time Position',
        value: {
          title: 'Content Writer',
          description: 'Part-time content writing for our blog and social media',
          type: 'PART_TIME',
          experienceLevel: 'INTERMEDIATE',
          businessId: 'business-uuid'
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Job created successfully',
    schema: {
      example: {
        id: 'job-uuid',
        title: 'Junior Full Stack Developer',
        description: 'We are looking for a passionate junior developer to join our team',
        type: 'FULL_TIME',
        experienceLevel: 'ENTRY_LEVEL',
        business: {
          id: 'business-uuid',
          businessName: 'TechCorp Solutions',
          businessType: 'TECHNOLOGY'
        },
        applications: []
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
          title: ['Job title is required'],
          description: ['Job description is required'],
          type: ['Job type must be a valid enum value'],
          experienceLevel: ['Experience level must be a valid enum value'],
          businessId: ['Business ID is required']
        }
      }
    }
  })
  async create(@Body() createJobDto: CreateJobDto, @Res() res: Response) {
    const result = await this.jobsService.create(createJobDto);
    res.locals.message = 'Job created successfully';
    return res.json({ data: result });
  }

  @Get()
  @Public()
  @ApiOperation({ 
    summary: 'Get all job postings',
    description: 'Retrieve a list of all available job postings'
  })
  @ApiOkResponse({
    description: 'List of jobs retrieved successfully',
    schema: {
      example: [
        {
          id: 'job-uuid-1',
          title: 'Junior Full Stack Developer',
          description: 'We are looking for a passionate junior developer to join our team',
          type: 'FULL_TIME',
          experienceLevel: 'ENTRY_LEVEL',
          business: {
            id: 'business-uuid-1',
            businessName: 'TechCorp Solutions',
            businessType: 'TECHNOLOGY'
          },
          applications: [
            {
              id: 'app-uuid-1',
              status: 'PENDING',
              student: {
                id: 'student-uuid-1',
                firstName: 'John',
                lastName: 'Doe'
              }
            }
          ]
        },
        {
          id: 'job-uuid-2',
          title: 'Marketing Intern',
          description: 'Summer internship opportunity in digital marketing',
          type: 'INTERNSHIP',
          experienceLevel: 'ENTRY_LEVEL',
          business: {
            id: 'business-uuid-2',
            businessName: 'Global Consulting Group',
            businessType: 'CONSULTING'
          },
          applications: []
        }
      ]
    }
  })
  async findAll(@Query('businessId') businessId: string, @Res() res: Response) {
    let result;
    if (businessId) {
      result = await this.jobsService.findByBusinessId(businessId);
    } else {
      result = await this.jobsService.findAll();
    }
    res.locals.message = 'Jobs retrieved successfully';
    return res.json({ data: result });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STUDENT, UserRole.BUSINESS)
  @ApiOperation({ 
    summary: 'Get job by ID',
    description: 'Retrieve a specific job posting by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Job unique identifier',
    example: 'uuid'
  })
  @ApiOkResponse({
    description: 'Job retrieved successfully',
    schema: {
      example: {
        id: 'job-uuid',
        title: 'Junior Full Stack Developer',
        description: 'We are looking for a passionate junior developer to join our team',
        type: 'FULL_TIME',
        experienceLevel: 'ENTRY_LEVEL',
        business: {
          id: 'business-uuid',
          businessName: 'TechCorp Solutions',
          businessType: 'TECHNOLOGY',
          location: 'San Francisco, CA'
        },
        applications: [
          {
            id: 'app-uuid-1',
            status: 'PENDING',
            createdAt: '2024-01-15T10:30:00.000Z',
            student: {
              id: 'student-uuid-1',
              firstName: 'John',
              lastName: 'Doe',
              major: 'COMPUTER_SCIENCE',
              year: 'SENIOR'
            }
          },
          {
            id: 'app-uuid-2',
            status: 'REVIEWED',
            createdAt: '2024-01-14T15:45:00.000Z',
            student: {
              id: 'student-uuid-2',
              firstName: 'Jane',
              lastName: 'Smith',
              major: 'SOFTWARE_ENGINEERING',
              year: 'JUNIOR'
            }
          }
        ]
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Job not found',
    schema: {
      example: {
        success: false,
        message: 'Job not found'
      }
    }
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.jobsService.findOne(id);
    if (!result) {
      throw new NotFoundException({ message: 'Job not found', errors: { id: ['Job does not exist'] } });
    }
    res.locals.message = 'Job retrieved successfully';
    return res.json({ data: result });
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
  @ApiOperation({ 
    summary: 'Update job posting',
    description: 'Update job posting information'
  })
  @ApiParam({
    name: 'id',
    description: 'Job unique identifier',
    example: 'uuid'
  })
  @ApiBody({
    type: UpdateJobDto,
    description: 'Job update data',
    examples: {
      updateTitle: {
        summary: 'Update Job Title',
        value: {
          title: 'Senior Full Stack Developer'
        }
      },
      updateDescription: {
        summary: 'Update Description',
        value: {
          description: 'Updated job description with new requirements'
        }
      },
      updateType: {
        summary: 'Update Job Type',
        value: {
          type: 'PART_TIME'
        }
      },
      updateExperience: {
        summary: 'Update Experience Level',
        value: {
          experienceLevel: 'INTERMEDIATE'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Job updated successfully',
    schema: {
      example: {
        id: 'job-uuid',
        title: 'Senior Full Stack Developer',
        description: 'We are looking for a passionate junior developer to join our team',
        type: 'FULL_TIME',
        experienceLevel: 'ENTRY_LEVEL',
        business: {
          id: 'business-uuid',
          businessName: 'TechCorp Solutions',
          businessType: 'TECHNOLOGY'
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
          title: ['Job title is required'],
          type: ['Job type must be a valid enum value'],
          experienceLevel: ['Experience level must be a valid enum value']
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Job not found',
    schema: {
      example: {
        success: false,
        message: 'Job not found'
      }
    }
  })
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Res() res: Response) {
    const result = await this.jobsService.update(id, updateJobDto);
    if (!result) {
      throw new NotFoundException({ message: 'Job not found', errors: { id: ['Job does not exist'] } });
    }
    res.locals.message = 'Job updated successfully';
    return res.json({ data: result });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
  @ApiOperation({ 
    summary: 'Delete job posting',
    description: 'Permanently delete a job posting'
  })
  @ApiParam({
    name: 'id',
    description: 'Job unique identifier',
    example: 'uuid'
  })
  @ApiNoContentResponse({
    description: 'Job deleted successfully'
  })
  @ApiNotFoundResponse({
    description: 'Job not found',
    schema: {
      example: {
        success: false,
        message: 'Job not found'
      }
    }
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const job = await this.jobsService.findOne(id);
    if (!job) {
      throw new NotFoundException({ message: 'Job not found', errors: { id: ['Job does not exist'] } });
    }
    await this.jobsService.remove(id);
    res.locals.message = 'Job deleted successfully';
    return res.json({ data: null });
  }

  @Post('applications')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  @ApiOperation({ 
    summary: 'Apply for job',
    description: 'Submit a job application from a student to a job posting'
  })
  @ApiBody({
    type: CreateApplicationDto,
    description: 'Job application data',
    examples: {
      standardApplication: {
        summary: 'Standard Application',
        value: {
          studentId: 'student-uuid',
          jobId: 'job-uuid'
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Application submitted successfully',
    schema: {
      example: {
        id: 'application-uuid',
        status: 'PENDING',
        createdAt: '2024-01-15T10:30:00.000Z',
        student: {
          id: 'student-uuid',
          firstName: 'John',
          lastName: 'Doe',
          major: 'COMPUTER_SCIENCE',
          year: 'SENIOR'
        },
        job: {
          id: 'job-uuid',
          title: 'Junior Full Stack Developer',
          business: {
            id: 'business-uuid',
            businessName: 'TechCorp Solutions'
          }
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
          studentId: ['Student ID is required'],
          jobId: ['Job ID is required']
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Student or job not found',
    schema: {
      example: {
        success: false,
        message: 'Student or job not found'
      }
    }
  })
  async createApplication(@Body() dto: CreateApplicationDto, @Res() res: Response) {
    const result = await this.jobsService.createApplication(dto);
    res.locals.message = 'Application submitted successfully';
    return res.json({ data: result });
  }
} 