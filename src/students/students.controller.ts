import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFiles, UploadedFile, Query } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { StudentsService } from './students.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { CreateTalentDto } from './dto/create-talent.dto';
import { UpdateTalentDto } from './dto/update-talent.dto';
import { LikeTalentDto } from './dto/like-talent.dto';
import { SaveTalentDto } from './dto/save-talent.dto';
import { CollaborationRequestDto } from './dto/collaboration-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  // Get all talents (for browsing) - must come before :id routes
  @Get('talents/all')
  getAllTalents() {
    return this.studentsService.getAllTalents();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }



  // Skills endpoints
  @Post(':id/skills')
  addSkill(@Param('id') id: string, @Body() createSkillDto: CreateSkillDto) {
    return this.studentsService.addSkill(id, createSkillDto);
  }

  @Patch(':id/skills/:skillId')
  updateSkill(@Param('id') id: string, @Param('skillId') skillId: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.studentsService.updateSkill(id, skillId, updateSkillDto);
  }

  @Delete(':id/skills/:skillId')
  removeSkill(@Param('id') id: string, @Param('skillId') skillId: string) {
    return this.studentsService.removeSkill(id, skillId);
  }

  // Profile image endpoints
  @Post(':id/profile-image')
  @UseInterceptors(FileInterceptor('profileImage', {
    storage: diskStorage({
      destination: './uploads/profiles',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.studentsService.uploadProfileImage(id, file);
  }

  @Delete(':id/profile-image')
  deleteProfileImage(@Param('id') id: string) {
    return this.studentsService.deleteProfileImage(id);
  }

  @Patch(':id/profile-views')
  updateProfileViews(@Param('id') id: string) {
    return this.studentsService.updateProfileViews(id);
  }

  // Projects endpoints
  @Post(':id/projects')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 }
  ], {
    storage: diskStorage({
      destination: './uploads/projects',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
      }
    })
  }))
  addProject(
    @Param('id') id: string, 
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] }
  ) {
    return this.studentsService.addProject(id, createProjectDto, files);
  }

  @Put(':id/projects/:projectId')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 }
  ], {
    storage: diskStorage({
      destination: './uploads/projects',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
      }
    })
  }))
  updateProject(
    @Param('id') id: string, 
    @Param('projectId') projectId: string, 
    @Body() updateProjectDto: CreateProjectDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] }
  ) {
    return this.studentsService.updateProject(id, projectId, updateProjectDto, files);
  }

  @Delete(':id/projects/:projectId')
  removeProject(@Param('id') id: string, @Param('projectId') projectId: string) {
    return this.studentsService.removeProject(id, projectId);
  }

  // Achievements endpoints
  @Post(':id/achievements')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 }
  ], {
    storage: diskStorage({
      destination: './uploads/achievements',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
      }
    })
  }))
  addAchievement(
    @Param('id') id: string, 
    @Body() createAchievementDto: CreateAchievementDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] }
  ) {
    return this.studentsService.addAchievement(id, createAchievementDto, files);
  }

  @Put(':id/achievements/:achievementId')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 }
  ], {
    storage: diskStorage({
      destination: './uploads/achievements',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
      }
    })
  }))
  updateAchievement(
    @Param('id') id: string, 
    @Param('achievementId') achievementId: string, 
    @Body() updateAchievementDto: CreateAchievementDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] }
  ) {
    return this.studentsService.updateAchievement(id, achievementId, updateAchievementDto, files);
  }

  @Delete(':id/achievements/:achievementId')
  removeAchievement(@Param('id') id: string, @Param('achievementId') achievementId: string) {
    return this.studentsService.removeAchievement(id, achievementId);
  }

  // Talents endpoints
  @Post(':id/talents')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 }
  ], {
    storage: diskStorage({
      destination: './uploads/talents',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
      }
    })
  }))
  addTalent(
    @Param('id') id: string, 
    @Body() createTalentDto: CreateTalentDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] }
  ) {
    return this.studentsService.addTalent(id, createTalentDto, files);
  }

  @Put(':id/talents/:talentId')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 }
  ], {
    storage: diskStorage({
      destination: './uploads/talents',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
      }
    })
  }))
  updateTalent(
    @Param('id') id: string, 
    @Param('talentId') talentId: string, 
    @Body() updateTalentDto: UpdateTalentDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] }
  ) {
    return this.studentsService.updateTalent(id, talentId, updateTalentDto, files);
  }

  @Delete(':id/talents/:talentId')
  removeTalent(@Param('id') id: string, @Param('talentId') talentId: string) {
    return this.studentsService.removeTalent(id, talentId);
  }

  @Get(':id/talents')
  getStudentTalents(@Param('id') id: string) {
    return this.studentsService.getStudentTalents(id);
  }

  // New social features endpoints
  @Post(':id/like-talent')
  likeTalent(
    @Param('id') id: string, 
    @Body() likeTalentDto: LikeTalentDto,
    @CurrentUser() user: User
  ) {
    return this.studentsService.likeTalent(id, likeTalentDto, user);
  }

  @Post(':id/save-talent')
  saveTalent(
    @Param('id') id: string, 
    @Body() saveTalentDto: SaveTalentDto,
    @CurrentUser() user: User
  ) {
    return this.studentsService.saveTalent(id, saveTalentDto, user);
  }

  @Post(':id/collaboration-request')
  requestCollaboration(
    @Param('id') id: string, 
    @Body() collaborationRequestDto: CollaborationRequestDto,
    @CurrentUser() user: User
  ) {
    return this.studentsService.requestCollaboration(id, collaborationRequestDto, user);
  }

  @Get(':id/liked-talents')
  getLikedTalents(@Param('id') id: string) {
    return this.studentsService.getLikedTalents(id);
  }

  @Get(':id/saved-talents')
  getSavedTalents(@Param('id') id: string) {
    return this.studentsService.getSavedTalents(id);
  }

  @Get(':id/collaboration-requests')
  getCollaborationRequests(@Param('id') id: string) {
    return this.studentsService.getCollaborationRequests(id);
  }

  @Put('collaboration/:collaborationId/respond')
  respondToCollaboration(
    @Param('collaborationId') collaborationId: string,
    @Body() response: { status: string; message?: string },
    @CurrentUser() user: User
  ) {
    return this.studentsService.respondToCollaboration(collaborationId, response, user);
  }
} 