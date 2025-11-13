import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { Proficiency } from '../enums/proficiency.enum';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  level: string; // beginner, intermediate, advanced, expert

  @Column({ nullable: true })
  category: string; // programming, design, business, etc.

  @Column({
    type: 'enum',
    enum: Proficiency,
    default: Proficiency.BEGINNER
  })
  proficiency: Proficiency;

  @ManyToOne(() => Student, student => student.skills)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 