import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultProficiencyToSkills1754000000008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add default proficiency to existing skills that don't have it
    await queryRunner.query(`
      UPDATE skills 
      SET proficiency = 'BEGINNER' 
      WHERE proficiency IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // This migration cannot be safely reversed
    console.log('Migration AddDefaultProficiencyToSkills cannot be reversed');
  }
}

