import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddYearColumnToStudents1754000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add year column to students table if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'students' AND column_name = 'year'
        ) THEN
          ALTER TABLE students ADD COLUMN year VARCHAR(20);
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE students DROP COLUMN IF EXISTS year;
    `);
  }
}

