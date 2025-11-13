import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationDto } from './dto/conversation.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(message);
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  async findConversation(dto: ConversationDto): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { senderId: dto.userA, receiverId: dto.userB },
        { senderId: dto.userB, receiverId: dto.userA },
      ],
      order: { createdAt: 'ASC' },
    });
  }
} 