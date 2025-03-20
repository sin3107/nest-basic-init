import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EnumToArray } from 'common/utils/enumNumberToArray';

export class SuccessCommonResponseDto<T> {
  @ApiProperty({ enum: EnumToArray(HttpStatus), description: '상태코드', required: true })
  @Expose()
  readonly statusCode: number;

  @ApiProperty({ type: Boolean, description: '성공여부', required: true })
  @Expose()
  readonly success: boolean;

  @ApiProperty({
    oneOf: [{ type: 'object' }, { type: 'array' }],
    description: 'object 또는 array 형식의 응답데이타가 옵니다.',
  })
  @Expose()
  data: T;
}