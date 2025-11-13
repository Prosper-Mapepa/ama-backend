import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './entities/student.entity';
import { Skill } from './entities/skill.entity';
import { Project } from './entities/project.entity';
import { Achievement } from './entities/achievement.entity';
import { StudentTalent } from './entities/talent.entity';
import { Collaboration } from './entities/collaboration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      Skill,
      Project,
      Achievement,
      StudentTalent,
      Collaboration,
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {} 