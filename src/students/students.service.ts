import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Student } from './entities/student.entity';
import { Project } from './entities/project.entity';
import { Achievement } from './entities/achievement.entity';
import { StudentTalent } from './entities/talent.entity';
import { Skill } from './entities/skill.entity';
import { Collaboration, CollaborationStatus } from './entities/collaboration.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { CreateTalentDto } from './dto/create-talent.dto';
import { UpdateTalentDto } from './dto/update-talent.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { LikeTalentDto } from './dto/like-talent.dto';
import { SaveTalentDto } from './dto/save-talent.dto';
import { CollaborationRequestDto } from './dto/collaboration-request.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Achievement)
    private achievementsRepository: Repository<Achievement>,
    @InjectRepository(StudentTalent)
    private talentsRepository: Repository<StudentTalent>,
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
    @InjectRepository(Collaboration)
    private collaborationsRepository: Repository<Collaboration>,
  ) {}

  async create(createStudentDto: any): Promise<Student> {
    const student = this.studentsRepository.create(createStudentDto);
    const result = await this.studentsRepository.save(student);
    // TypeORM returns an array when saving a single entity
    if (Array.isArray(result)) {
      return result[0];
    }
    return result;
  }

  async findAll(): Promise<Student[]> {
    return this.studentsRepository.find({
      relations: ['user', 'talents', 'skills', 'projects', 'achievements'],
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { id },
      relations: ['user', 'talents', 'skills', 'projects', 'achievements'],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    Object.assign(student, updateStudentDto);
    return this.studentsRepository.save(student);
  }

  async findByUserId(userId: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'talents', 'skills', 'projects', 'achievements'],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  // Projects methods
  async addProject(studentId: string, createProjectDto: CreateProjectDto, files?: any): Promise<Project> {
    const student = await this.findOne(studentId);
    let images: string[] = [];
    
    if (files && files.files) {
      images = files.files.map((file: any) => `/uploads/projects/${file.filename}`);
    }
    
    const project = this.projectsRepository.create({
      ...createProjectDto,
      images,
      student,
    });
    return this.projectsRepository.save(project);
  }

  async updateProject(studentId: string, projectId: string, updateProjectDto: CreateProjectDto, files?: any): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId, student: { id: studentId } },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    
    let images: string[] = project.images || [];
    if (files && files.files) {
      images = files.files.map((file: any) => `/uploads/projects/${file.filename}`);
    }
    
    Object.assign(project, { ...updateProjectDto, images });
    return this.projectsRepository.save(project);
  }

  async removeProject(studentId: string, projectId: string): Promise<void> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId, student: { id: studentId } },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    await this.projectsRepository.remove(project);
  }

  // Achievements methods
  async addAchievement(studentId: string, createAchievementDto: CreateAchievementDto, files?: any): Promise<Achievement> {
    const student = await this.findOne(studentId);
    let fileArr: string[] = [];
    
    if (files && files.files) {
      fileArr = files.files.map((file: any) => `/uploads/achievements/${file.filename}`);
    }
    
    const achievement = this.achievementsRepository.create({
      ...createAchievementDto,
      files: fileArr,
      student,
    });
    return this.achievementsRepository.save(achievement);
  }

  async updateAchievement(studentId: string, achievementId: string, updateAchievementDto: CreateAchievementDto, files?: any): Promise<Achievement> {
    const achievement = await this.achievementsRepository.findOne({
      where: { id: achievementId, student: { id: studentId } },
    });
    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }
    
    let fileArr: string[] = achievement.files || [];
    if (files && files.files) {
      fileArr = files.files.map((file: any) => `/uploads/achievements/${file.filename}`);
    }
    
    Object.assign(achievement, { ...updateAchievementDto, files: fileArr });
    return this.achievementsRepository.save(achievement);
  }

  async removeAchievement(studentId: string, achievementId: string): Promise<void> {
    const achievement = await this.achievementsRepository.findOne({
      where: { id: achievementId, student: { id: studentId } },
    });
    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }
    await this.achievementsRepository.remove(achievement);
  }

  // Talents methods
  async addTalent(studentId: string, createTalentDto: CreateTalentDto, files?: any): Promise<StudentTalent> {
    const student = await this.findOne(studentId);
    let filePaths: string[] = [];
    
    if (files && files.files) {
      filePaths = files.files.map((file: any) => `/uploads/talents/${file.filename}`);
    }
    
    const talent = this.talentsRepository.create({
      ...createTalentDto,
      files: filePaths,
      student,
    });
    return this.talentsRepository.save(talent);
  }

  async updateTalent(studentId: string, talentId: string, updateTalentDto: UpdateTalentDto, files?: any): Promise<StudentTalent> {
    const talent = await this.talentsRepository.findOne({
      where: { id: talentId, student: { id: studentId } },
    });
    if (!talent) {
      throw new NotFoundException('Talent not found');
    }
    
    let filePaths: string[] = talent.files || [];
    if (files && files.files) {
      filePaths = files.files.map((file: any) => `/uploads/talents/${file.filename}`);
    }
    
    Object.assign(talent, { ...updateTalentDto, files: filePaths });
    return this.talentsRepository.save(talent);
  }

  async removeTalent(studentId: string, talentId: string): Promise<void> {
    const talent = await this.talentsRepository.findOne({
      where: { id: talentId, student: { id: studentId } },
    });
    if (!talent) {
      throw new NotFoundException('Talent not found');
    }
    await this.talentsRepository.remove(talent);
  }

  async getStudentTalents(studentId: string): Promise<StudentTalent[]> {
    return this.talentsRepository.find({
      where: { student: { id: studentId } },
      order: { createdAt: 'DESC' },
    });
  }

  async uploadProfileImage(studentId: string, file: Express.Multer.File): Promise<Student> {
    const student = await this.findOne(studentId);
    
    // Delete old profile image if it exists
    if (student.profileImage) {
      // Note: In production, you'd want to delete the actual file from disk
      // For now, we'll just update the database
    }
    
    // Update student with new profile image path
    student.profileImage = `/uploads/profiles/${file.filename}`;
    return this.studentsRepository.save(student);
  }

  async deleteProfileImage(studentId: string): Promise<Student> {
    const student = await this.findOne(studentId);
    
    // Note: In production, you'd want to delete the actual file from disk
    // For now, we'll just update the database
    student.profileImage = '';
    return this.studentsRepository.save(student);
  }

  async updateProfileViews(studentId: string): Promise<Student> {
    const student = await this.findOne(studentId);
    
    // Increment profile views count
    student.profileViews = (student.profileViews || 0) + 1;
    return this.studentsRepository.save(student);
  }

  async getAllTalents(): Promise<StudentTalent[]> {
    return this.talentsRepository.find({
      relations: ['student'],
      order: { createdAt: 'DESC' },
    });
  }

  // New social features methods
  // Social features methods
  async likeTalent(studentId: string, likeTalentDto: LikeTalentDto, user: User): Promise<Student> {
    // Any authenticated user can like any talent
    // Just verify that the user is authenticated (which is handled by JWT guard)
    
    const student = await this.findOne(studentId);
    const { talentId, isLiked } = likeTalentDto;

    if (!student.likedTalents) {
      student.likedTalents = [];
    }

    if (isLiked) {
      if (!student.likedTalents.includes(talentId)) {
        student.likedTalents.push(talentId);
      }
    } else {
      student.likedTalents = student.likedTalents.filter(id => id !== talentId);
    }

    // Ensure likedTalents is always an array and properly formatted for PostgreSQL
    if (!Array.isArray(student.likedTalents)) {
      student.likedTalents = [];
    }
    
    // Filter out any undefined or null values
    student.likedTalents = student.likedTalents.filter(id => id != null);

    return this.studentsRepository.save(student);
  }

  async saveTalent(studentId: string, saveTalentDto: SaveTalentDto, user: User): Promise<Student> {
    // Any authenticated user can save any talent
    // Just verify that the user is authenticated (which is handled by JWT guard)
    
    const student = await this.findOne(studentId);
    const { talentId, isSaved } = saveTalentDto;

    if (!student.savedTalents) {
      student.savedTalents = [];
    }

    if (isSaved) {
      if (!student.savedTalents.includes(talentId)) {
        student.savedTalents.push(talentId);
      }
    } else {
      student.savedTalents = student.savedTalents.filter(id => id !== talentId);
    }

    // Ensure savedTalents is always an array and properly formatted for PostgreSQL
    if (!Array.isArray(student.savedTalents)) {
      student.savedTalents = [];
    }
    
    // Filter out any undefined or null values
    student.savedTalents = student.savedTalents.filter(id => id != null);

    return this.studentsRepository.save(student);
  }

  async getLikedTalents(studentId: string): Promise<StudentTalent[]> {
    const student = await this.findOne(studentId);
    if (!student.likedTalents || student.likedTalents.length === 0) {
      return [];
    }

    return this.talentsRepository.findBy({ id: In(student.likedTalents) });
  }

  async getSavedTalents(studentId: string): Promise<StudentTalent[]> {
    const student = await this.findOne(studentId);
    if (!student.savedTalents || student.savedTalents.length === 0) {
      return [];
    }

    return this.talentsRepository.findBy({ id: In(student.savedTalents) });
  }

  async requestCollaboration(studentId: string, collaborationRequestDto: CollaborationRequestDto, user: User): Promise<Collaboration> {
    console.log('requestCollaboration called with:', { studentId, collaborationRequestDto, user });
    console.log('User object:', JSON.stringify(user, null, 2));
    
    // Verify the user is authenticated
    if (!user.id) {
      throw new ForbiddenException('User not authenticated');
    }
    
    // Check if user is trying to collaborate with themselves
    if (studentId === collaborationRequestDto.recipientId) {
      throw new ForbiddenException('You cannot request collaboration with yourself');
    }

    console.log('Creating collaboration:', { requesterId: studentId, recipientId: collaborationRequestDto.recipientId });

    const collaboration = this.collaborationsRepository.create({
      ...collaborationRequestDto,
      requesterId: studentId,
    });

    return this.collaborationsRepository.save(collaboration);
  }

  async getCollaborationRequests(studentId: string): Promise<Collaboration[]> {
    return this.collaborationsRepository.find({
      where: [
        { requesterId: studentId },
        { recipientId: studentId }
      ],
      relations: ['requester', 'recipient', 'talent'],
    });
  }

  async respondToCollaboration(collaborationId: string, response: { status: string; message?: string }, user: User): Promise<Collaboration> {
    const collaboration = await this.collaborationsRepository.findOne({
      where: { id: collaborationId },
      relations: ['recipient'],
    });

    if (!collaboration) {
      throw new NotFoundException('Collaboration request not found');
    }

    // Verify the user is the recipient or has permission
    if (user.role !== 'admin' && user.student?.id !== collaboration.recipientId) {
      throw new ForbiddenException('You can only respond to collaboration requests sent to you');
    }

    collaboration.status = response.status as CollaborationStatus;
    if (response.message) {
      collaboration.responseMessage = response.message;
    }

    return this.collaborationsRepository.save(collaboration);
  }

  // Skills methods
  async addSkill(studentId: string, createSkillDto: any): Promise<any> {
    const student = await this.findOne(studentId);
    
    const skill = this.skillsRepository.create({
      ...createSkillDto,
      student,
    });
    return this.skillsRepository.save(skill);
  }

  async updateSkill(studentId: string, skillId: string, updateSkillDto: any): Promise<Skill> {
    const skill = await this.skillsRepository.findOne({
      where: { id: skillId, student: { id: studentId } },
    });
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    
    Object.assign(skill, updateSkillDto);
    return this.skillsRepository.save(skill);
  }

  async removeSkill(studentId: string, skillId: string): Promise<void> {
    const skill = await this.skillsRepository.findOne({
      where: { id: skillId, student: { id: studentId } },
    });
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    
    await this.skillsRepository.remove(skill);
  }
} 