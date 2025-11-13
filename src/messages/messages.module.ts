import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { User } from '../users/entities/user.entity';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation, User])],
  controllers: [MessagesController, ConversationsController],
  providers: [MessagesService, ConversationsService],
  exports: [MessagesService, ConversationsService],
})
export class MessagesModule {} 