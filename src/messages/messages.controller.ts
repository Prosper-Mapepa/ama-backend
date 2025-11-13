import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Res, UseGuards } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBadRequestResponse, 
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationDto } from './dto/conversation.dto';
import { Response } from 'express';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Messages')
@Controller('messages')
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
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(UserRole.ADMIN, UserRole.STUDENT, UserRole.BUSINESS)
  @ApiOperation({ 
    summary: 'Send message',
    description: 'Send a message between users (students and businesses)'
  })
  @ApiBody({
    type: CreateMessageDto,
    description: 'Message data',
    examples: {
      jobInquiry: {
        summary: 'Job Inquiry',
        value: {
          senderId: 'student-uuid',
          receiverId: 'business-uuid',
          content: 'Hello! I\'m interested in the Junior Developer position you posted. Could you tell me more about the role and requirements?'
        }
      },
      applicationUpdate: {
        summary: 'Application Update',
        value: {
          senderId: 'business-uuid',
          receiverId: 'student-uuid',
          content: 'Thank you for your application! We\'ve reviewed your profile and would like to schedule an interview. Are you available next week?'
        }
      },
      generalInquiry: {
        summary: 'General Inquiry',
        value: {
          senderId: 'student-uuid',
          receiverId: 'business-uuid',
          content: 'I saw your company profile and I\'m very interested in learning more about your internship opportunities for next summer.'
        }
      },
      followUp: {
        summary: 'Follow-up Message',
        value: {
          senderId: 'business-uuid',
          receiverId: 'student-uuid',
          content: 'Hi! Just following up on our previous conversation about the internship position. Do you have any questions about the role?'
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Message sent successfully',
    schema: {
      example: {
        id: 'message-uuid',
        content: 'Hello! I\'m interested in the Junior Developer position you posted. Could you tell me more about the role and requirements?',
        sender: {
          id: 'student-uuid',
          firstName: 'John',
          lastName: 'Doe',
          role: 'student'
        },
        receiver: {
          id: 'business-uuid',
          businessName: 'TechCorp Solutions',
          role: 'business'
        },
        createdAt: '2024-01-15T10:30:00.000Z'
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
          senderId: ['Sender ID is required'],
          receiverId: ['Receiver ID is required'],
          content: ['Message content is required']
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Sender or receiver not found',
    schema: {
      example: {
        success: false,
        message: 'Sender or receiver not found'
      }
    }
  })
  async create(@Body() createMessageDto: CreateMessageDto, @Res() res: Response) {
    const result = await this.messagesService.create(createMessageDto);
    res.locals.message = 'Message sent successfully';
    return res.json({ data: result });
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get all messages',
    description: 'Retrieve all messages in the system (admin only)'
  })
  @ApiOkResponse({
    description: 'List of messages retrieved successfully',
    schema: {
      example: [
        {
          id: 'message-uuid-1',
          content: 'Hello! I\'m interested in the Junior Developer position you posted.',
          sender: {
            id: 'student-uuid-1',
            firstName: 'John',
            lastName: 'Doe',
            role: 'student'
          },
          receiver: {
            id: 'business-uuid-1',
            businessName: 'TechCorp Solutions',
            role: 'business'
          },
          createdAt: '2024-01-15T10:30:00.000Z'
        },
        {
          id: 'message-uuid-2',
          content: 'Thank you for your application! We\'ve reviewed your profile and would like to schedule an interview.',
          sender: {
            id: 'business-uuid-1',
            businessName: 'TechCorp Solutions',
            role: 'business'
          },
          receiver: {
            id: 'student-uuid-1',
            firstName: 'John',
            lastName: 'Doe',
            role: 'student'
          },
          createdAt: '2024-01-15T11:45:00.000Z'
        },
        {
          id: 'message-uuid-3',
          content: 'I saw your company profile and I\'m very interested in learning more about your internship opportunities.',
          sender: {
            id: 'student-uuid-2',
            firstName: 'Jane',
            lastName: 'Smith',
            role: 'student'
          },
          receiver: {
            id: 'business-uuid-2',
            businessName: 'Global Consulting Group',
            role: 'business'
          },
          createdAt: '2024-01-14T15:20:00.000Z'
        }
      ]
    }
  })
  async findAll(@Res() res: Response) {
    const result = await this.messagesService.findAll();
    res.locals.message = 'Messages retrieved successfully';
    return res.json({ data: result });
  }

  @Post('conversation')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(UserRole.ADMIN, UserRole.STUDENT, UserRole.BUSINESS)
  @ApiOperation({ 
    summary: 'Get conversation between users',
    description: 'Retrieve all messages between two specific users'
  })
  @ApiBody({
    type: ConversationDto,
    description: 'Conversation participants',
    examples: {
      studentBusiness: {
        summary: 'Student-Business Conversation',
        value: {
          userA: 'student-uuid',
          userB: 'business-uuid'
        }
      },
      studentStudent: {
        summary: 'Student-Student Conversation',
        value: {
          userA: 'student-uuid-1',
          userB: 'student-uuid-2'
        }
      },
      businessBusiness: {
        summary: 'Business-Business Conversation',
        value: {
          userA: 'business-uuid-1',
          userB: 'business-uuid-2'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Conversation retrieved successfully',
    schema: {
      example: [
        {
          id: 'message-uuid-1',
          content: 'Hello! I\'m interested in the Junior Developer position you posted. Could you tell me more about the role and requirements?',
          sender: {
            id: 'student-uuid',
            firstName: 'John',
            lastName: 'Doe',
            role: 'student'
          },
          receiver: {
            id: 'business-uuid',
            businessName: 'TechCorp Solutions',
            role: 'business'
          },
          createdAt: '2024-01-15T10:30:00.000Z'
        },
        {
          id: 'message-uuid-2',
          content: 'Thank you for your interest! The Junior Developer role involves working with React, Node.js, and MongoDB. We\'re looking for someone with strong problem-solving skills and a passion for learning.',
          sender: {
            id: 'business-uuid',
            businessName: 'TechCorp Solutions',
            role: 'business'
          },
          receiver: {
            id: 'student-uuid',
            firstName: 'John',
            lastName: 'Doe',
            role: 'student'
          },
          createdAt: '2024-01-15T11:00:00.000Z'
        },
        {
          id: 'message-uuid-3',
          content: 'That sounds perfect! I have experience with React and Node.js from my coursework and personal projects. I\'d love to learn more about the team and company culture.',
          sender: {
            id: 'student-uuid',
            firstName: 'John',
            lastName: 'Doe',
            role: 'student'
          },
          receiver: {
            id: 'business-uuid',
            businessName: 'TechCorp Solutions',
            role: 'business'
          },
          createdAt: '2024-01-15T11:30:00.000Z'
        },
        {
          id: 'message-uuid-4',
          content: 'Great! We have a collaborative team of 15 developers and we emphasize continuous learning. Would you be available for a technical interview next week?',
          sender: {
            id: 'business-uuid',
            businessName: 'TechCorp Solutions',
            role: 'business'
          },
          receiver: {
            id: 'student-uuid',
            firstName: 'John',
            lastName: 'Doe',
            role: 'student'
          },
          createdAt: '2024-01-15T12:00:00.000Z'
        }
      ]
    }
  })
  @ApiBadRequestResponse({
    description: 'Validation error or invalid data',
    schema: {
      example: {
        success: false,
        message: 'Validation failed',
        errors: {
          userA: ['User A ID is required'],
          userB: ['User B ID is required']
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'One or both users not found',
    schema: {
      example: {
        success: false,
        message: 'One or both users not found'
      }
    }
  })
  async findConversation(@Body() dto: ConversationDto, @Res() res: Response) {
    const result = await this.messagesService.findConversation(dto);
    res.locals.message = 'Conversation retrieved successfully';
    return res.json({ data: result });
  }
} 