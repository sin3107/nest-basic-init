import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ErrorResponseOption } from '../../../common/decorators/ErrorResponse.decorator';
type Keys =
  | 'Auth-E001'
  | 'Auth-E002'
  | 'Auth-E003'
  | 'Auth-E004'
  | 'Auth-E005'
  | 'Auth-E006'
  | 'Auth-E007';

export const AuthErrorDefine: Record<Keys, ErrorResponseOption & { code: string }> = {
  'Auth-E001': {
    exampleDescription: '서버 내부 에러 시 발생하는 오류',
    exampleTitle: 'INTERNAL_SERVER_ERROR',
    message: '서버 에러',
    code: 'Auth-E001',
  },
  'Auth-E002': {
    exampleDescription: '이메일이 존재하지 않을떄 발생하는 오류',
    exampleTitle: '이메일이 존재하지 않았을 때',
    message: '로그인 실패',
    code: 'Auth-E002',
  },
  'Auth-E003': {
    exampleDescription: '비밀번호가 틀렸을때 발생하는 오류',
    exampleTitle: '비밀번호 틀렸을 때',
    message: '로그인 실패',
    code: 'Auth-E003',
  },
  'Auth-E004': {
    exampleDescription: '이메일이 중복됐을때 발생하는 오류',
    exampleTitle: '이메일 중복',
    message: '이미 존재하는 이메일입니다',
    code: 'Auth-E004',
  },
  'Auth-E005': {
    exampleDescription: '유저가 존재하지 않을 때 발생하는 오류',
    exampleTitle: '유저 없음',
    message: '해당하는 유저가 없습니다',
    code: 'Auth-E005',
  },
  'Auth-E006': {
    exampleDescription: '이메일 인증 중 에러가 발생 했을때',
    exampleTitle: '이메일 인증 실패',
    message: '이메일 인증 실패했습니다',
    code: 'Auth-E006',
  },
  'Auth-E007': {
    exampleDescription: '신고 누적 5회 이상일떄 발생하는 오류 메시지',
    exampleTitle: '신고 5회 이상',
    message: '신고 누적 5회 이상인 유저입니다',
    code: 'Auth-E007',
  },
};