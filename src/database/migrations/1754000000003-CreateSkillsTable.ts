import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSkillsTable1754000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the skills table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        level VARCHAR(50),
        category VARCHAR(100),
        student_id UUID REFERENCES students(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS skills;`);
  }
}
