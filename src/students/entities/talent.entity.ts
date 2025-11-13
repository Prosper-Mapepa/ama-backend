import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';

@Entity('student_talents')
export class StudentTalent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 50 })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  files: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Student, student => student.talents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;
} 