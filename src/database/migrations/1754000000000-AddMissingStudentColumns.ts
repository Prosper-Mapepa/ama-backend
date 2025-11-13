import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingStudentColumns1754000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add missing columns to students table
    await queryRunner.query(`
      ALTER TABLE students 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT now(),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT now(),
      ADD COLUMN IF NOT EXISTS liked_talents text[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS saved_talents text[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS collaborations text[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student',
      ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255),
      ADD COLUMN IF NOT EXISTS gpa VARCHAR(10),
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS graduation_year VARCHAR(20),
      ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
    `);

    // Add missing columns to student_talents table
    await queryRunner.query(`
      ALTER TABLE student_talents 
      ADD COLUMN IF NOT EXISTS files text[] DEFAULT '{}';
    `);

    // Create collaborations table if it doesn't exist
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS collaborations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        requester_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        recipient_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        talent_id uuid REFERENCES student_talents(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        response_message TEXT,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);

    // Add indexes for better performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_students_role ON students(role);
      CREATE INDEX IF NOT EXISTS idx_students_major ON students(major);
      CREATE INDEX IF NOT EXISTS idx_collaborations_requester ON collaborations(requester_id);
      CREATE INDEX IF NOT EXISTS idx_collaborations_recipient ON collaborations(recipient_id);
      CREATE INDEX IF NOT EXISTS idx_collaborations_status ON collaborations(status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_students_role;
      DROP INDEX IF EXISTS idx_students_major;
      DROP INDEX IF EXISTS idx_collaborations_requester;
      DROP INDEX IF EXISTS idx_collaborations_recipient;
      DROP INDEX IF EXISTS idx_collaborations_status;
    `);

    // Drop collaborations table
    await queryRunner.query(`
      DROP TABLE IF EXISTS collaborations;
    `);

    // Remove columns from student_talents table
    await queryRunner.query(`
      ALTER TABLE student_talents 
      DROP COLUMN IF EXISTS files;
    `);

    // Remove columns from students table
    await queryRunner.query(`
      ALTER TABLE students 
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at,
      DROP COLUMN IF EXISTS liked_talents,
      DROP COLUMN IF EXISTS saved_talents,
      DROP COLUMN IF EXISTS collaborations,
      DROP COLUMN IF EXISTS role,
      DROP COLUMN IF EXISTS profile_image,
      DROP COLUMN IF EXISTS gpa,
      DROP COLUMN IF EXISTS bio,
      DROP COLUMN IF EXISTS graduation_year,
      DROP COLUMN IF EXISTS email;
    `);
  }
}
