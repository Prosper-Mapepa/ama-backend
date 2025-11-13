import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedJobs1680000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, let's get a business ID (we'll use the first business or create one)
    const businessResult = await queryRunner.query(`
      SELECT id FROM businesses LIMIT 1;
    `);
    
    let businessId;
    if (businessResult.length > 0) {
      businessId = businessResult[0].id;
    } else {
      // Create a test business if none exists
      const businessInsert = await queryRunner.query(`
        INSERT INTO businesses (id, business_name, email, business_type, location, created_at, updated_at)
        VALUES (
          gen_random_uuid(),
          'Test Business',
          'test@business.com',
          'TECHNOLOGY',
          'Pittsburgh, PA',
          now(),
          now()
        ) RETURNING id;
      `);
      businessId = businessInsert[0].id;
    }

    // Add test jobs with different timestamps to show the date posted feature
    await queryRunner.query(`
      INSERT INTO jobs (id, title, description, type, experience_level, location, salary, business_id, created_at, updated_at)
      VALUES 
        (
          gen_random_uuid(),
          'Frontend Developer Intern',
          'Join our team as a frontend developer intern. You will work with React, TypeScript, and modern web technologies.',
          'INTERNSHIP',
          'ENTRY_LEVEL',
          'Pittsburgh, PA',
          '$25/hour',
          '${businessId}',
          now() - interval '2 days',
          now() - interval '2 days'
        ),
        (
          gen_random_uuid(),
          'Data Science Assistant',
          'Help us analyze data and create insights. Experience with Python and machine learning preferred.',
          'PART_TIME',
          'INTERMEDIATE',
          'Remote',
          '$30/hour',
          '${businessId}',
          now() - interval '5 days',
          now() - interval '5 days'
        ),
        (
          gen_random_uuid(),
          'Marketing Coordinator',
          'Coordinate marketing campaigns and social media content. Creative and organized individuals welcome.',
          'FULL_TIME',
          'ENTRY_LEVEL',
          'Pittsburgh, PA',
          '$45,000/year',
          '${businessId}',
          now() - interval '1 week',
          now() - interval '1 week'
        ),
        (
          gen_random_uuid(),
          'Software Engineer',
          'Build scalable applications using modern technologies. Strong problem-solving skills required.',
          'FULL_TIME',
          'SENIOR',
          'Pittsburgh, PA',
          '$80,000/year',
          '${businessId}',
          now() - interval '3 weeks',
          now() - interval '3 weeks'
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM jobs WHERE title IN (
        'Frontend Developer Intern',
        'Data Science Assistant', 
        'Marketing Coordinator',
        'Software Engineer'
      );
    `);
  }
} 