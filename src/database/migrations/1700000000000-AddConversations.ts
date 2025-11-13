import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConversations1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE conversations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE conversation_participants (
        conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (conversation_id, user_id)
      );

      ALTER TABLE messages
        ADD COLUMN conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE messages DROP COLUMN IF EXISTS conversation_id;
      DROP TABLE IF EXISTS conversation_participants;
      DROP TABLE IF EXISTS conversations;
    `);
  }
} 