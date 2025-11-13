import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileImage1700000000005 implements MigrationInterface {
    name = 'AddProfileImage1700000000005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" ADD "profile_image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "profile_image"`);
    }
} 