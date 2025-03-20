import { ErrorResponseOption } from 'common/decorators/ErrorResponse.decorator';
type Keys =
    | 'User-E001'
    | 'User-E002'
    | 'User-E003'
    | 'User-E004';
  
  export const UserErrorDefine: Record<Keys, ErrorResponseOption & { code: string }> = {
    'User-E001': {
      exampleDescription: '서버 내부 에러 시 발생하는 오류',
      exampleTitle: 'INTERNAL_SERVER_ERROR',
      message: '서버 에러',
      code: 'User-E001',
    },
    'User-E002': {
      exampleDescription: '서버 문제로 비밀번호 변경 실패',
      exampleTitle: '서버 에러',
      message: '비밀번호 변경 실패',
      code: 'User-E002',
    },
    'User-E003': {
      exampleDescription: '유저를 찿을 수 없을 때 발생하는 오류',
      exampleTitle: '유저를 찿을 수 없음',
      message: '유저를 찿을 수 없습니다',
      code: 'User-E003',
    },
    'User-E004': {
      exampleDescription: '서버 내부 에러로 이메일을 중복 체크 실패',
      exampleTitle: '이메일 중복 체크 실패',
      message: '이메일을 중복 체크하는 중 에러가 발생했습니다',
      code: 'User-E004',
    },
  };