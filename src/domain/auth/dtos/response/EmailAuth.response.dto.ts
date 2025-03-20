import { ApiProperty } from '@nestjs/swagger';

export class EmailAuthResponseDTO {
  @ApiProperty({
    description: '이메일 인증 성공했을때 메시지',
    default: 'success',
  })
  message: string;
}