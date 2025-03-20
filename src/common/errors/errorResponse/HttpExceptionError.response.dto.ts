import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { EnumToArray } from 'common/utils/enumNumberToArray';
import { HttpErrorNameEnum } from './HttpErrorNameEnum';

export class HttpExceptionErrorResponseDto {


  @ApiProperty({
    type: String,
    description: '에러메시지',
  })
  @Expose()
  message: string;

  @ApiProperty({
    type: Number,
    description: '에러코드가 넘어옵니다. 널값일 수 있습니다!!!',
    nullable: true,
  })
  @Expose()
  code?: number | string;

  @ApiProperty({
    type: Number,
    description: '에러코드가 넘어옵니다. 널값일 수 있습니다!!!',
    nullable: true,
  })
  @Expose()
  statusCode?: number | string;

  constructor(message: string, code?: number | string) {
    // this.error = error;
    // this.statusCode = statusCode;
    this.message = message;
    this.code = code;
  }

}