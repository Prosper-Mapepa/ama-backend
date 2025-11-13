import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @ManyToOne(() => Student, student => student.projects)
  @JoinColumn({ name: 'student_id' })
  student: Student;
} 