import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { Application } from './entities/application.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Business } from '../businesses/entities/business.entity';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const business = await this.businessRepository.findOne({ where: { id: createJobDto.businessId } });
    if (!business) {
      throw new NotFoundException({ message: 'Business not found', errors: { businessId: ['Business does not exist'] } });
    }
    const job = this.jobRepository.create({ ...createJobDto, business });
    return this.jobRepository.save(job);
  }

  async findAll(): Promise<Job[]> {
    const jobs = await this.jobRepository.find({
      relations: [
        'business',
        'applications',
        'applications.student',
        'applications.student.achievements',
        'applications.student.projects'
      ],
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        experienceLevel: true,
        location: true,
        salary: true,
        createdAt: true,
        updatedAt: true,
        business: true,
        applications: {
          id: true,
          status: true,
          createdAt: true,
          student: {
            id: true,
            firstName: true,
            lastName: true,
            major: true,
            achievements: true,
            projects: true,
          },
        },
      },
    });
    return jobs.map(job => ({ ...job, applications: job.applications ?? [] }));
  }

  async findOne(id: string): Promise<Job | null> {
    return this.jobRepository.findOne({ where: { id }, relations: ['business', 'applications', 'applications.student', 'milestones', 'deliverables'] });
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job | null> {
    await this.jobRepository.update(id, updateJobDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.jobRepository.delete(id);
  }

  async createApplication(dto: CreateApplicationDto): Promise<Application> {
    const student = await this.studentRepository.findOne({ where: { id: dto.studentId } });
    const job = await this.jobRepository.findOne({ where: { id: dto.jobId } });
    
    if (!student) {
      throw new NotFoundException({ message: 'Student not found', errors: { studentId: ['Student does not exist'] } });
    }
    
    if (!job) {
      throw new NotFoundException({ message: 'Job not found', errors: { jobId: ['Job does not exist'] } });
    }
    
    const application = this.applicationRepository.create({ student, job });
    return this.applicationRepository.save(application);
  }

  async findByBusinessId(businessId: string): Promise<Job[]> {
    const jobs = await this.jobRepository.find({
      where: { business: { id: businessId } },
      relations: [
        'business',
        'applications',
        'applications.student',
        'applications.student.achievements',
        'applications.student.projects'
      ]
    });
    return jobs.map(job => ({ ...job, applications: job.applications ?? [] }));
  }
} 