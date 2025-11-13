import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './entities/business.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async create(createBusinessDto: CreateBusinessDto): Promise<Business> {
    const business = this.businessRepository.create(createBusinessDto);
    return this.businessRepository.save(business);
  }

  async findAll(): Promise<Business[]> {
    return this.businessRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Business | null> {
    return this.businessRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto): Promise<Business | null> {
    await this.businessRepository.update(id, updateBusinessDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.businessRepository.delete(id);
  }

  async findByUserId(userId: string): Promise<Business | null> {
    return this.businessRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] });
  }
} 