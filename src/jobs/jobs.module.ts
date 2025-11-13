import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './entities/job.entity';
import { Application } from './entities/application.entity';
import { Business } from '../businesses/entities/business.entity';
import { Student } from '../students/entities/student.entity';
import { Milestone } from './entities/milestone.entity';
import { Deliverable } from './entities/deliverable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Application, Business, Student, Milestone, Deliverable])],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {} 