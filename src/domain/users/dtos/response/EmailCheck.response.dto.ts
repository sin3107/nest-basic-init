import { ApiProperty } from '@nestjs/swagger';

export class EmailCheckResponseDTO {
  @ApiProperty({
    description: '이메일이 중복되면 true, 아니면 false',
  })
  result: boolean;
}