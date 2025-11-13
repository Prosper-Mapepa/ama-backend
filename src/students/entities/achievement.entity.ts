import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'text', array: true, nullable: true })
  files: string[];

  @ManyToOne(() => Student, student => student.achievements)
  @JoinColumn({ name: 'student_id' })
  student: Student;
} 