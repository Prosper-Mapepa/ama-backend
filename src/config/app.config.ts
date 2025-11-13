import * as dotenv from 'dotenv';
dotenv.config();

export const appConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL,
  corsOrigin: process.env.CORS_ORIGIN,
  logLevel: process.env.LOG_LEVEL || 'info',
}; 