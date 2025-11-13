import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Business } from '../../businesses/entities/business.entity';
import { JobType } from '../enums/job-type.enum';
import { ExperienceLevel } from '../enums/experience-level.enum';
import { Application } from './application.entity';
import { Milestone } from './milestone.entity';
import { Deliverable } from './deliverable.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: JobType })
  type: JobType;

  @Column({ name: 'experience_level', type: 'enum', enum: ExperienceLevel })
  experienceLevel: ExperienceLevel;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  salary: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @OneToMany(() => Application, application => application.job)
  applications: Application[];

  @OneToMany(() => Milestone, milestone => milestone.job)
  milestones: Milestone[];

  @OneToMany(() => Deliverable, deliverable => deliverable.job)
  deliverables: Deliverable[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 