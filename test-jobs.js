const { Client } = require('pg');

async function testJobs() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'cmu_talent_hub',
    user: 'postgres',
    password: 'Letmein@99x!'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const result = await client.query(`
      SELECT id, title, created_at, updated_at 
      FROM jobs 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    console.log('Jobs in database:');
    result.rows.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title}`);
      console.log(`   ID: ${job.id}`);
      console.log(`   Created: ${job.created_at}`);
      console.log(`   Updated: ${job.updated_at}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

testJobs(); 