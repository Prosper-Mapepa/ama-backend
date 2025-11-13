import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialSchema1680000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        email_verified BOOLEAN DEFAULT false,
        agreed_to_terms BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE students (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        major VARCHAR(50) NOT NULL,
        year VARCHAR(20) NOT NULL,
        user_id uuid UNIQUE REFERENCES users(id),
        about text,
        profile_views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE businesses (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        business_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        business_type VARCHAR(50) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        website VARCHAR(255),
        user_id uuid UNIQUE REFERENCES users(id),
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE jobs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        experience_level VARCHAR(20) NOT NULL,
        location VARCHAR(255),
        salary VARCHAR(255),
        business_id uuid REFERENCES businesses(id),
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE applications (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id uuid REFERENCES students(id),
        job_id uuid REFERENCES jobs(id),
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE messages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id uuid NOT NULL,
        receiver_id uuid NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE skills (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        proficiency VARCHAR(20) NOT NULL,
        student_id uuid REFERENCES students(id)
      );

      CREATE TABLE projects (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255),
        student_id uuid REFERENCES students(id),
        images text[] NULL
      );

      CREATE TABLE achievements (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        student_id uuid REFERENCES students(id),
        files text[] NULL
      );

      CREATE TABLE milestones (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
        due_date DATE NOT NULL,
        completed_date DATE,
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE deliverables (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
        due_date DATE NOT NULL,
        completed_date DATE,
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE student_skills (
        student_id uuid REFERENCES students(id) ON DELETE CASCADE,
        skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
        PRIMARY KEY (student_id, skill_id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS student_skills;
      DROP TABLE IF EXISTS deliverables;
      DROP TABLE IF EXISTS milestones;
      DROP TABLE IF EXISTS messages;
      DROP TABLE IF EXISTS applications;
      DROP TABLE IF EXISTS jobs;
      DROP TABLE IF EXISTS skills;
      DROP TABLE IF EXISTS projects;
      DROP TABLE IF EXISTS achievements;
      DROP TABLE IF EXISTS businesses;
      DROP TABLE IF EXISTS students;
      DROP TABLE IF EXISTS users;
    `);
  }
} 