import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingSkillColumns1754000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add missing columns to skills table
    await queryRunner.query(`
      ALTER TABLE skills 
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS level VARCHAR(50),
      ADD COLUMN IF NOT EXISTS category VARCHAR(100);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE skills 
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS level,
      DROP COLUMN IF EXISTS category;
    `);
  }
}
