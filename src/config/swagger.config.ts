import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Student Talent Hub API')
  .setDescription(`
    # Student Talent Hub API Documentation
    
    A comprehensive platform connecting students with businesses for internships, jobs, and career opportunities.
    
    ## Overview
    This API provides endpoints for:
    - **Authentication**: User registration and login for students and businesses
    - **User Management**: CRUD operations for user accounts
    - **Student Profiles**: Student information, skills, projects, and achievements
    - **Business Profiles**: Company information and job postings
    - **Job Management**: Job postings, applications, and hiring process
    - **Messaging**: Communication between students and businesses
    - **Admin Functions**: Platform statistics and management
    
    ## Authentication
    Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
    \`\`\`
    Authorization: Bearer <your-jwt-token>
    \`\`\`
    
    ## Rate Limiting
    API endpoints are rate-limited to prevent abuse. Limits are applied per IP address.
    
    ## Error Handling
    The API returns consistent error responses with appropriate HTTP status codes and detailed error messages.
    
    ## Data Validation
    All request bodies are validated using class-validator decorators. Invalid requests will return 400 Bad Request with validation details.
  `)
  .setVersion('1.0.0')
  .addTag('Health Check', 'API health and status endpoints')
  .addTag('Authentication', 'User registration and login endpoints')
  .addTag('Users', 'User account management endpoints')
  .addTag('Students', 'Student profile and portfolio management')
  .addTag('Businesses', 'Business profile and company information')
  .addTag('Jobs', 'Job postings and applications')
  .addTag('Messages', 'Communication between users')
  .addTag('Admin', 'Administrative functions and statistics')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .addServer('http://localhost:3000', 'Development server')
  .addServer('https://api.studenttalenhub.com', 'Production server')
  .setContact(
    'Student Talent Hub Team',
    'https://studenttalenhub.com',
    'support@studenttalenhub.com'
  )
  .setLicense(
    'MIT License',
    'https://opensource.org/licenses/MIT'
  )
  .build(); 