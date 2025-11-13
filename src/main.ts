import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import { appConfig } from './config/app.config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { Express } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        }),
      ],
    }),
  });

  app.use(helmet());
  // Update the CORS configuration to include PATCH method
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://35.32.91.174:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Add PATCH here
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
  });

  // Replace the existing static file serving with this updated version
  app.use('/uploads', (req: Request, res: Response, next: NextFunction) => {
    // Set CORS headers for all uploads requests
    res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Set proper MIME types for different file types
    const filePath = req.path;
    const ext = filePath.split('.').pop()?.toLowerCase();
    
    // MIME types mapping
    const mimeTypes: { [key: string]: string } = {
      // Video files
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogg': 'video/ogg',
      'mov': 'video/quicktime',
      // Image files
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'avif': 'image/avif',
      // Document files
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    
    if (ext && mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
    }
    
    // Serve static files
    const express = require('express');
    const staticMiddleware = express.static('uploads');
    
    // Add error handling for static file serving
    staticMiddleware(req, res, (err: any) => {
      if (err) {
        console.error('Static file serving error:', err);
        res.status(404).send('File not found');
      }
    });
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(appConfig.port, '0.0.0.0');
  console.log(`Server running on http://0.0.0.0:${appConfig.port}`);
  console.log(`Local access: http://localhost:${appConfig.port}`);
  console.log(`Network access: http://${process.env.LOCAL_IP || '0.0.0.0'}:${appConfig.port}`);
}

bootstrap();
