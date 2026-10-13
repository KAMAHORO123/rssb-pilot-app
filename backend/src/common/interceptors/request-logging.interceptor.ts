import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from "@nestjs/common";
import { Observable, finalize } from "rxjs";

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    const method = request?.method ?? "";
    const url = request?.originalUrl ?? request?.url ?? "";
    const userId = request?.user?.userId ?? "-";
    const start = Date.now();

    return next.handle().pipe(
      finalize(() => {
        const statusCode = response?.statusCode ?? 200;
        const durationMs = Date.now() - start;
        this.logger.log(
          `${method} ${url} ${statusCode} ${durationMs}ms userId=${userId}`
        );
      })
    );
  }
}
