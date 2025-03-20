import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'domain/users/entities/user.entity';

export class UserLoginResponseDTO {
  @ApiProperty({
    description: 'access token',
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFiY0BoaWdoZGV2LmNvbSIsInN1YiI6IjEzNzIzMjI1LWY5YWYtNDNlNi04OGQ3LWIyM2I5YmIxYzk1ZCIsImlhdCI6MTY4MDIyNjMwMSwiZXhwIjoxNjgwMzEyNzAxfQ.z4tuwc5pqo1rIuSZZ2l6H_FRGOX-vjcBcPSp9DFwGSo',
    required: true,
  })
  @Exclude()
  accessToken: string;

  @ApiProperty({
    description: 'refresh token',
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFiY0BoaWdoZGV2LmNvbSIsInN1YiI6IjEzNzIzMjI1LWY5YWYtNDNlNi04OGQ3LWIyM2I5YmIxYzk1ZCIsImlhdCI6MTY4MDIyNjMwMSwiZXhwIjoxNjgwMzEyNzAxfQ.z4tuwc5pqo1rIuSZZ2l6H_FRGOX-vjcBcPSp9DFwGSo',
    required: true,
  })
  @Exclude()
  refreshToken: string;

  @ApiProperty({
    description: '유저정보',
  })
  userInfo: User;
}