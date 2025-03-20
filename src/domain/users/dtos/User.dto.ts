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
import { ProfileDTO } from 'domain/users/dtos/Profile.dto';
import { UserStatus } from 'domain/users/entities/user.entity';

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

  @ApiProperty()
  profile: ProfileDTO;

  @ApiProperty({ description: '유저 상태', enum: UserStatus })
  @IsEnum(UserStatus)
  @IsOptional()
  userStatus?: UserStatus;

  @ApiProperty({ description: 'fcm', default: null })
  fcm?: string;
}