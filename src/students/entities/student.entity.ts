import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { StudentTalent } from './talent.entity';
import { Project } from './project.entity';
import { Achievement } from './achievement.entity';
import { UserRole } from '../../users/enums/user-role.enum';
import { User } from '../../users/entities/user.entity';
import { AcademicYear } from '../enums/year.enum';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ name: 'major', nullable: true })
  major: string;

  @Column({ 
    name: 'year', 
    type: 'enum',
    enum: AcademicYear
  })
  year: AcademicYear;

  @Column({ name: 'graduation_year', nullable: true })
  graduationYear: string;

  @Column({ nullable: true })
  gpa: string;

  @Column({ name: 'profile_image', type: 'varchar', nullable: true })
  profileImage: string;

  @Column({ name: 'profile_views', nullable: true, default: 0 })
  profileViews: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Column({ name: 'liked_talents', type: 'text', array: true, nullable: true, default: [] })
  likedTalents: string[]; // Array of talent IDs that this student has liked

  @Column({ name: 'saved_talents', type: 'text', array: true, nullable: true, default: [] })
  savedTalents: string[]; // Array of talent IDs that this student has saved

  @Column({ name: 'collaborations', type: 'text', array: true, nullable: true, default: [] })
  collaborations: string[]; // Array of collaboration request IDs

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => StudentTalent, talent => talent.student)
  talents: StudentTalent[];

  @OneToMany(() => Project, project => project.student)
  projects: Project[];

  @OneToMany(() => Achievement, achievement => achievement.student)
  achievements: Achievement[];

  @OneToMany('Skill', 'student')
  skills: any[];
} 