import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ProfileDTO } from './profile.dto';
import { UserStatus } from '../entities/user.entity';

export enum Paid {
  ALL = 'ALL',
  PAID = 'PAID',
  FREE = 'FREE',
}

export class UserDTO {
  @ApiProperty({ description: 'id', default: '1' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '이메일', default: 'abc@highdev.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'userCode' })
  userCode: string;

  @ApiProperty({ description: 'user name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'user birth' })
  @IsString()
  @IsOptional()
  birth?: string;

  @ApiProperty({ description: 'user phone' })
  @IsPhoneNumber('KR')
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: '비밀번호인데 실제 response에서는 안나올거임', default: '123123' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'refresh token' })
  @IsString()
  refreshToken: string;

  @ApiProperty({ description: '신고 횟수', default: 0 })
  @IsNumber()
  reportCount: number;

  @ApiProperty({ description: '필수동의', default: true })
  @IsBoolean()
  essentialAgree: boolean;

  @ApiProperty({ description: '맞춤형 서비스 동의', default: true })
  @IsBoolean()
  customizedServiceAgree: boolean;

  @ApiProperty({ description: '마케팅 수신 동의', default: true })
  @IsBoolean()
  marketingAgree: boolean;

  @ApiProperty()
  profile: ProfileDTO;

  @ApiProperty({ description: '유저 상태', enum: UserStatus })
  @IsEnum(UserStatus)
  @IsOptional()
  userStatus?: UserStatus;

  @ApiProperty({ description: 'fcm', default: null })
  fcm?: string;
}