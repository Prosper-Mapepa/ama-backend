import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedUsers1680000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await bcrypt.hash('AdminPass123!', 10);
    await queryRunner.query(`
      INSERT INTO users (id, email, password, role, status, email_verified, agreed_to_terms, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        'admin@cmu.edu',
        '${password}',
        'admin',
        'active',
        true,
        true,
        now(),
        now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM users WHERE email = 'admin@cmu.edu';`);
  }
} 