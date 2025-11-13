import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BusinessType } from '../enums/business-type.enum';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'business_name' })
  businessName: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'business_type', type: 'enum', enum: BusinessType })
  businessType: BusinessType;

  @Column()
  location: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  website?: string;

  @OneToOne(() => User, user => user.business)
  @JoinColumn({ name: 'user_id' })
  user: User;
} 