import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Job } from './job.entity';

@Entity('deliverables')
export class Deliverable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Job, job => job.deliverables, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ name: 'completed_date', type: 'date', nullable: true })
  completedDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 