import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { databaseConfig } from './config/database.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ThrottleGuard } from './common/guards/throttle.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// import { GlobalValidationPipe } from './common/pipes/validation.pipe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { BusinessesModule } from './businesses/businesses.module';
import { JobsModule } from './jobs/jobs.module';
import { MessagesModule } from './messages/messages.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    ThrottlerModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(),'uploads'),
      serveRoot: '/uploads',
      // Add CORS headers for static files
      serveStaticOptions: {
        setHeaders: (res, path) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
        },
      },
    }),
    UsersModule,
    AuthModule,
    StudentsModule,
    BusinessesModule,
    JobsModule,
    MessagesModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottleGuard },
    // GlobalValidationPipe,
  ],
})
export class AppModule {}
