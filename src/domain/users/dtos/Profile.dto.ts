import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProfileDTO {
  @ApiProperty({ description: '닉네임', default: '강형욱' })
  nickname: string;

  @ApiProperty({ description: '유저 id', default: 0, type: 'number' })
  userId: number;
}