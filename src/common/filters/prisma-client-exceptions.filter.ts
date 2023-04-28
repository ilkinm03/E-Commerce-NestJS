import {
  ArgumentsHost, Catch,
  ExceptionFilter, HttpStatus,
} from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { BaseExceptionFilter } from "@nestjs/core";
import { Prisma } from "@prisma/client";
import { Response } from "express";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionsFilter extends BaseExceptionFilter
  implements ExceptionFilter {
  constructor() {
    super();
  }

  public catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const message: string = exception.message.replace(/\n/g, "");
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    switch (exception.code) {
      case "P2002":
        statusCode = HttpStatus.CONFLICT;
        response.status(statusCode).json({
          statusCode,
          message,
        });
        break;
      case "P2025":
        statusCode = HttpStatus.NOT_FOUND;
        response.status(statusCode).json({
          statusCode,
          message: "not found",
        });
        break;
      default:
        super.catch(exception, host);
        break;
    }
  }
}