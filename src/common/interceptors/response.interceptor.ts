import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    return next.handle().pipe(
      map(data => {
        // Allow controller/service to set a custom message on the response object
        const message = response.locals && response.locals.message
          ? response.locals.message
          : 'Request successful';
        return { success: true, data, message };
      }),
    );
  }
} 