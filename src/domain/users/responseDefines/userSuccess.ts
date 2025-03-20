import { SuccessResponseOption } from 'common/decorators/SuccessResponse.decorator';
import { EmailCheckResponseDTO } from 'domain/users/dtos/response/EmailCheck.response.dto';
type Keys = 'User-S001';

export const UserSuccessDefine: Record<Keys, SuccessResponseOption & { code: string }> = {
  'User-S001': {
    model: EmailCheckResponseDTO,
    exampleDescription: '이메일이 중복되면 true, 아니면 false',
    exampleTitle: '이메일 중복 체크',
    code: 'User-S002',
  }
};