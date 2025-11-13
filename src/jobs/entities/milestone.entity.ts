import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Job } from './job.entity';

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity('milestones')
export class Milestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Job, job => job.milestones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: MilestoneStatus, default: MilestoneStatus.PENDING })
  status: MilestoneStatus;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: string;

  @Column({ name: 'completed_date', type: 'date', nullable: true })
  completedDate: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 