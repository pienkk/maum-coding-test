import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { QueryFailedError } from 'typeorm';
@Catch()
export class GlobalExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo<GraphQLResolveInfo>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message.message;
    let code = 'HttpException';

    switch (exception.constructor) {
      case HttpException:
        status = (exception as HttpException).getStatus();
        break;

      case QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        code = (exception as any).code;
        break;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date(),
      error: status,
    };

    const error = {
      ...errorResponse,
      type: info.parentType,
      field: info.fieldName,
      message,
      code,
    };

    Logger.error(
      `${info.parentType} ${info.fieldName}`,
      JSON.stringify(error),
      'ExceptionFilter',
    );

    return exception;
  }
}
