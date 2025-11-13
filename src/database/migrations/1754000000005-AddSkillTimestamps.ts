import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSkillTimestamps1754000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add missing timestamp columns to skills table
    await queryRunner.query(`
      ALTER TABLE skills 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE skills 
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at;
    `);
  }
}
