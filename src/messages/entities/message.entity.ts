import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sender_id' })
  senderId: string;

  @Column({ name: 'receiver_id' })
  receiverId: string;

  @Column()
  content: string;

  @Column({ name: 'conversation_id', nullable: true })
  conversationId: string;

  @ManyToOne(() => Conversation, conversation => conversation.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 