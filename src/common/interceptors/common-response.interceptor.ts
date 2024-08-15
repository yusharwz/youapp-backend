import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MongoError } from 'mongodb';

@Injectable()
export class CommonResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const statusCode = data?.statusCode || HttpStatus.OK;
        return {
          success: true,
          statusCode: statusCode,
          message: data?.message || 'Request successfully processed',
          data: data?.data || data,
        };
      }),

      catchError((error) => {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'An unexpected error occurred';
        let errorDetails = 'Internal Server Error';

        if (error instanceof HttpException) {
          status = error.getStatus();
          const response = error.getResponse();
          if (typeof response === 'object' && response !== null) {
            message = response['message'] || message;
            errorDetails = response['error'] || errorDetails;
          }
        } else if (error instanceof MongoError) {
          if (error.code === 11000) {
            status = HttpStatus.CONFLICT;
            message = 'Duplicate key error';
            errorDetails = 'Conflict';
          } else {
            message = error.message;
          }
        } else if (error instanceof Error) {
          message = error.message;
        }

        return throwError(() => ({
          success: false,
          message: Array.isArray(message) ? message : [message],
          error: errorDetails,
          statusCode: status,
        }));
      }),
    );
  }
}
