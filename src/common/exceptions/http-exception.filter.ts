import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    UnauthorizedException,
    Logger,
  } from '@nestjs/common';
  import { ThrottlerException } from '@nestjs/throttler';
  import { Request, Response } from 'express';
  import { AuthErrorDefine } from 'src/domain/auth/responseDefines/authErrors';
  import { ErrorCommonResponse } from '../errors/errorResponse/ErrorCommonResponse.dto';
  import { HttpExceptionErrorResponseDto } from '../errors/errorResponse/HttpExceptionError.response.dto';
  import { QueryFailedError } from 'typeorm';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    constructor() {}
    async catch(exception: Error, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let statusCode: number;
      let error;
  
      if (exception instanceof ThrottlerException) {
        statusCode = 429;
        error = {
          code: 429,
          message: 'ThrottlerException',
          // error: ThrottlerException.name,
          // statusCode: 429,
        };
      } else if (exception instanceof HttpException) {
        statusCode = exception.getStatus();
  
        const getError = exception.getResponse();
        if (typeof getError === 'string') {
          error = {
            message: getError,
          };
        } else if (getError === undefined) {
          error = {
            code: 500,
            message: 'internal server error',
          };
        } else if (statusCode === 400) {
          const objError = getError as HttpExceptionErrorResponseDto;
  
          error = {
            code: 104,
            message: objError.message,
          };
        } else if (statusCode === 402) {
          const objError = getError as HttpExceptionErrorResponseDto;
  
          error = {
            code: 105,
            message: objError.message,
          };
        } else {
          // 에러 코드화를 진행할 부분
          const objError = getError as HttpExceptionErrorResponseDto;
  
          error = {
            code: objError.code,
            message: objError.message,
          };
        }
      } else if (exception instanceof QueryFailedError) {
        error = {
          code: HttpStatus.BAD_REQUEST,
          message: 'QueryFailedError',
          query: exception.query,
          parameters: exception.parameters,
        };
      } else {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  
        error = {
          error: 'Internal server error',
          statusCode: statusCode,
          message: exception.stack,
        };
      }
      if (!statusCode) {
        statusCode = 500;
      }
  
      const errorResponse: ErrorCommonResponse<HttpExceptionErrorResponseDto> = {
        statusCode: statusCode,
        success: false,
        timestamp: new Date(),
        path: request.url,
        method: request.method,
        error: error,
      };
  
      Logger.error('ExceptionsFilter', exception.stack, request.method + request.url);
  
      return response.status(statusCode).json(errorResponse);
    }
  }
