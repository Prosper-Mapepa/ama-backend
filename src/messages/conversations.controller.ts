import { Controller, Get, Post, Param, Body, Delete, Req } from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../auth/decorators/public.decorator';
// import { AuthGuard } from '../auth/guards/auth.guard'; // Uncomment if you want to protect routes
// import { UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
// @UseGuards(AuthGuard) // Uncomment to protect all routes
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @Public()
  async findAll(@Req() req: Request) {
    // Get userId from query parameter since we're using @Public()
    const userId = req.query.userId as string;
    if (!userId) {
      // If no userId provided, return empty array
      return { data: [] };
    }
    const conversations = await this.conversationsService.findAllForUser(userId);
    return { data: conversations };
  }

  @Post()
  @Public()
  async create(@Body() createConversationDto: { participantIds: string[] }) {
    const conversation = await this.conversationsService.create(createConversationDto.participantIds);
    return { data: conversation };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.conversationsService.remove(id);
  }

  @Get(':id/messages')
  @Public()
  async getMessages(@Param('id') id: string) {
    return this.conversationsService.getMessages(id);
  }

  @Post(':id/messages')
  @Public()
  async sendMessage(@Param('id') id: string, @Body() createMessageDto: { senderId: string, content: string }) {
    return this.conversationsService.sendMessage(id, createMessageDto.senderId, createMessageDto.content);
  }
} 