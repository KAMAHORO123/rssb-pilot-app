import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      response.status(status).json(body);
      return;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      this.handlePrismaError(exception, response);
      return;
    }

    this.logger.error(
      "Unhandled exception",
      exception instanceof Error ? exception.stack : String(exception)
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error"
    });
  }

  private handlePrismaError(
    exception: Prisma.PrismaClientKnownRequestError,
    response: Response
  ) {
    switch (exception.code) {
      case "P2002": {
        const target = (exception.meta?.target as string[]) ?? [];
        const field = target.length > 0 ? target.join(", ") : "field";
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: `A record with this ${field} already exists`
        });
        return;
      }
      case "P2025":
        response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: "Record not found"
        });
        return;
      default:
        this.logger.error(`Prisma error ${exception.code}`, exception.message);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Internal server error"
        });
    }
  }
}
