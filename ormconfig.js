require('dotenv').config();

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.{js,ts}'],
  migrations: ['src/database/migrations/*.{js,ts}'],
  seeds: ['src/database/seeds/*.{js,ts}'],
  cli: {
    migrationsDir: 'src/database/migrations',
    seedsDir: 'src/database/seeds',
  },
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
}; 