import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, SelectQueryBuilder } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { User } from '../users/entities/user.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async findAllForUser(userId: string): Promise<Conversation[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participants')
      .innerJoin('conversation_participants', 'cp', 'cp.conversation_id = conversation.id')
      .where('cp.user_id = :userId', { userId })
      .orderBy('conversation.updatedAt', 'DESC')
      .getMany();
  }

  async create(participantIds: string[]): Promise<Conversation> {
    const users = await this.userRepository.findBy({ id: In(participantIds) });
    if (users.length !== participantIds.length) {
      throw new NotFoundException('One or more users not found');
    }
    
    // Create conversation with participants
    const conversation = this.conversationRepository.create();
    const saved = await this.conversationRepository.save(conversation);
    
    // Add participants to the conversation
    saved.participants = users;
    const savedWithParticipants = await this.conversationRepository.save(saved);
    
    // Fetch with participants
    const found = await this.conversationRepository.findOne({
      where: { id: savedWithParticipants.id },
      relations: ['participants'],
    });
    if (!found) throw new NotFoundException('Conversation not found after creation');
    return found;
  }

  async findOne(id: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['participants'],
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async remove(id: string): Promise<void> {
    await this.conversationRepository.delete(id);
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { conversationId: conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
    const conversation = await this.conversationRepository.findOne({ 
      where: { id: conversationId },
      relations: ['participants']
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    
    // Find the other participant to set as receiverId
    const otherParticipant = conversation.participants.find(p => p.id !== senderId);
    
    const message = this.messageRepository.create({
      conversationId: conversationId,
      senderId,
      content,
      receiverId: otherParticipant?.id || senderId, // Fallback to senderId if no other participant found
    });
    return this.messageRepository.save(message);
  }
} 