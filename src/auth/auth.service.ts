import { Injectable, UnauthorizedException, BadRequestException, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { StudentsService } from '../students/students.service';
import { BusinessesService } from '../businesses/businesses.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateStudentDto } from '../students/dto/create-student.dto';
import { CreateBusinessDto } from '../businesses/dto/create-business.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private studentsService: StudentsService,
    private businessesService: BusinessesService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail?.(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: any) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException({ message: 'Invalid credentials', errors: { email: ['User not found'] } });
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException({ message: 'Invalid credentials', errors: { password: ['Incorrect password'] } });
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    let student = null;
    let business = null;
    if (user.role === UserRole.STUDENT) {
      student = await this.studentsService.findByUserId(user.id);
    }
    if (user.role === UserRole.BUSINESS) {
      business = await this.businessesService.findByUserId(user.id);
    }
    return {
      data: {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        ...(student ? { student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          major: student.major,
        }} : {}),
        ...(business ? { business: {
          id: business.id,
          businessName: business.businessName,
          businessType: business.businessType,
          location: business.location,
        }} : {}),
      },
      message: 'Login successful',
    };
  }

  async registerStudent(dto: any) {
    // Check if user already exists
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException({ message: 'Email already registered', errors: { email: ['Email already exists'] } });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    // Create user
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      role: UserRole.STUDENT,
      agreedToTerms: dto.agreedToTerms,
    } as CreateUserDto);
    // Create student profile
    const student = await this.studentsService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      major: dto.major,
      year: dto.year,
      user: user,
    });
    // Create JWT token for the new user
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);
    return {
      data: {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          major: student.major,
        },
      },
      message: 'Student registered successfully',
    };
  }

  async registerBusiness(dto: any) {
    // Check if user already exists
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException({ message: 'Email already registered', errors: { email: ['Email already exists'] } });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    // Create user
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      role: UserRole.BUSINESS,
      agreedToTerms: dto.agreedToTerms,
    } as CreateUserDto);
    // Create business profile
    const business = await this.businessesService.create({
      businessName: dto.businessName,
      email: dto.email,
      businessType: dto.businessType,
      location: dto.location,
      user: user,
    } as CreateBusinessDto);
    // Create JWT token for the new user
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);
    return {
      data: {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        business: {
          id: business.id,
          businessName: business.businessName,
          businessType: business.businessType,
          location: business.location,
        },
      },
      message: 'Business registered successfully',
    };
  }
} 