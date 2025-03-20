import { SuccessResponseOption } from 'src/common/decorators/SuccessResponse.decorator';
import { GetUserInfoResponseDTO } from '../dto/response/GetUserInfo.response.dto';
import { EmailAuthResponseDTO } from '../dto/response/EmailAuth.response.dto';
type Keys = 'Auth-S001' | 'Auth-S004';

export const AuthSuccessDefine: Record<Keys, SuccessResponseOption & { code: string }> = {
  'Auth-S001': {
    model: GetUserInfoResponseDTO,
    exampleDescription: '토큰으로 유저 정보 가져온다',
    exampleTitle: '유저 정보 가져오기',
    code: 'Auth-S001',
  },

  'Auth-S004': {
    model: EmailAuthResponseDTO,
    exampleDescription: '이메일 인증이 성공했을때 메시지',
    exampleTitle: '이메일 인증 성공',
    code: 'Auth-S004',
  },
};