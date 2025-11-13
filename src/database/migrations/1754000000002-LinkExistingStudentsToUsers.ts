import { MigrationInterface, QueryRunner } from 'typeorm';

export class LinkExistingStudentsToUsers1754000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Link existing students to users based on email
    await queryRunner.query(`
      UPDATE students 
      SET user_id = users.id 
      FROM users 
      WHERE students.email = users.email 
      AND users.role = 'student';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // This migration cannot be easily reversed as it's linking existing data
    // In a real scenario, you might want to backup the data first
    await queryRunner.query(`
      UPDATE students 
      SET user_id = NULL;
    `);
  }
}
