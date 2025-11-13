import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdToStudents1754000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add user_id column to students table
    await queryRunner.query(`
      ALTER TABLE students 
      ADD COLUMN IF NOT EXISTS user_id uuid UNIQUE REFERENCES users(id) ON DELETE CASCADE;
    `);

    // Add index for better performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove index
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_students_user_id;
    `);

    // Remove user_id column
    await queryRunner.query(`
      ALTER TABLE students 
      DROP COLUMN IF EXISTS user_id;
    `);
  }
}
