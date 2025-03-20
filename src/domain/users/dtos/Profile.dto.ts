import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProfileDTO {
  @ApiProperty({ description: '닉네임', default: '강형욱' })
  nickname: string;

  // @ApiProperty({ description: '이미지 등록 ID', default: 52 })
  // profileImgId: number;

  @ApiProperty({ description: '반려동물 경력', default: 0, type: 'number' })
  career: number;

  @ApiProperty({ description: '유저 id', default: 0, type: 'number' })
  userId: number;
}