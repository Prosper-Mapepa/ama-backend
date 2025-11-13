import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTalentFiles1753809290264 implements MigrationInterface {
    name = 'AddTalentFiles1753809290264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_talents" ADD "files" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_talents" DROP COLUMN "files"`);
    }
} 