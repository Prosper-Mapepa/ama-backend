import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { Business } from '../../businesses/entities/business.entity';
import { Student } from '../../students/entities/student.entity';
// Import Student and Business entities once they are created

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
  

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'agreed_to_terms', default: true })
  agreedToTerms: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToOne(() => Student, student => student.user)
  student: Student;

  @OneToOne(() => Business, business => business.user)
  business: Business;
} 