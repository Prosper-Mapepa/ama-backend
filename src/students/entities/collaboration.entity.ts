import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { StudentTalent } from './talent.entity';

export enum CollaborationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

@Entity('collaborations')
export class Collaboration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requesterId: string; // Student requesting collaboration

  @Column()
  recipientId: string; // Student being requested for collaboration

  @Column({ nullable: true })
  talentId: string; // Optional: specific talent to collaborate on

  @Column({ type: 'text' })
  message: string; // Collaboration request message

  @Column({ type: 'enum', enum: CollaborationStatus, default: CollaborationStatus.PENDING })
  status: CollaborationStatus;

  @Column({ nullable: true })
  responseMessage: string; // Response from recipient

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Student, student => student.id)
  @JoinColumn({ name: 'requesterId' })
  requester: Student;

  @ManyToOne(() => Student, student => student.id)
  @JoinColumn({ name: 'recipientId' })
  recipient: Student;

  @ManyToOne(() => StudentTalent, talent => talent.id)
  @JoinColumn({ name: 'talentId' })
  talent: StudentTalent;
}
