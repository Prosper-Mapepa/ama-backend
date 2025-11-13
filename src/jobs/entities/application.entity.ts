import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, JoinColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Job } from './job.entity';
import { ApplicationStatus } from '../enums/application-status.enum';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Job, job => job.applications)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 