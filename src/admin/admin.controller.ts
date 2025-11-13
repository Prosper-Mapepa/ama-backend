import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UserStatsDto } from './dto/user-stats.dto';
import { Response } from 'express';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Admin')
@Controller('admin')
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
  description: 'Admin access required',
  schema: {
    example: {
      success: false,
      message: 'Forbidden - Admin access required'
    }
  }
})
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('user-stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get user statistics',
    description: 'Retrieve platform statistics including user counts by status (admin only)'
  })
  @ApiOkResponse({
    description: 'User statistics retrieved successfully',
    type: UserStatsDto,
    schema: {
      example: {
        total: 1250,
        active: 1180,
        inactive: 45,
        suspended: 25
      }
    }
  })
  async getUserStats(@Res() res: Response) {
    const result = await this.adminService.getUserStats();
    res.locals.message = 'User statistics retrieved successfully';
    return res.json({ data: result });
  }
} 