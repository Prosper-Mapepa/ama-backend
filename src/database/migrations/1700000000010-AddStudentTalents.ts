import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStudentTalents1700000000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE student_talents (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        title varchar(100) NOT NULL,
        category varchar(50) NOT NULL,
        description text,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS student_talents;
    `);
  }
} 