import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const shouldRunMigrations = (() => {
  const flag = process.env.DB_RUN_MIGRATIONS;
  if (flag === 'true' || flag === 'false') {
    return flag === 'true';
  }
  return process.env.NODE_ENV !== 'production';
})();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: shouldRunMigrations,
  logging: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*.{js,ts}'],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
}; 