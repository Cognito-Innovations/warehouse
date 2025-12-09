import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ClientIdentifierInterceptor implements NestInterceptor {
  intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const http = context.switchToHttp();
    const request = http.getRequest<
      Request & { clientIdentifierId?: string }
    >();
    const response = http.getResponse<Response>();

    return next.handle().pipe(
      map((responseBody: T) => {
        const identifier = request?.clientIdentifierId;
        if (identifier) {
          response.setHeader('X-Client-Identifier', identifier);
        }
        return responseBody;
      }),
    );
  }
}
