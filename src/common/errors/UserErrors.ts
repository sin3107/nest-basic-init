import { ErrorResponseOption } from 'common/decorators/ErrorResponse.decorator';

type Keys =
  | 'USER_NOT_FOUND'
  | 'EMAIL_NOT_FOUND'
  | 'WRONG_PASSWORD'  
  | 'DUPLICATED_EMAIL'
  | 'EMAIL_ALREADY_EXIST'
  | 'CHANGE_PW_FAIL'
  | 'PROFILE_UPLOAD_FAIL'
  | 'DUPLICATED_NICKNAME'
  | 'PROFILE_NOT_FOUND'
  | 'VALIDATE_FAIL'
  | 'REFRESH_TOKEN_NOT_FOUND'
  | 'REFRESH_TOKEN_NOT_MATCH'
  | 'WRONG_PASSWORD2';

export const User: Record<Keys, ErrorResponseOption & { code?: number }> = {
  USER_NOT_FOUND: {
    exampleTitle: '유저 없음',
    exampleDescription: '해당하는 유저가 등록되지 않았을때 발생하는 에러',
    message: '유저를 찾을 수 없습니다',
    code: 300,
  },
  EMAIL_NOT_FOUND: {
    exampleTitle: '이메일이 존재하지 않음',
    exampleDescription: '해당하는 이메일이 등록되지 않았을때 발생하는 에러',
    message: '로그인 실패',
    code: 301,
  },
  WRONG_PASSWORD: {
    exampleTitle: '비밀번호 틀림',
    exampleDescription: '비밀번호 틀렸을때',
    message: '로그인 실패',
    code: 302,
  },
  VALIDATE_FAIL: {
    exampleTitle: 'invalidated access token',
    exampleDescription: 'access token이 유효하지 않을때',
    message: 'invalidated access token',
    code: 303,
  },  
  REFRESH_TOKEN_NOT_FOUND: {
    exampleTitle: 'refresh token not found',
    exampleDescription: 'user entity에 저장된 refresh token이 없을때',
    message: 'user에 저장된 refresh token이 없습니다',
    code: 304,
  },
  REFRESH_TOKEN_NOT_MATCH: {
    exampleTitle: 'refresh token 이 일치하지 않음',
    exampleDescription: 'user에 저장된 refresh token이랑 일치하지 않을때',
    message: 'refresh token이 일치하지 않습니다',
    code: 305,
  },
  DUPLICATED_EMAIL: {
    exampleTitle: '중복된 이메일',
    exampleDescription: '이메일이 중복됐을때 발생',
    message: '중복된 이메일',
    code: 305,
  },
  EMAIL_ALREADY_EXIST: {
    exampleTitle: '이미 존재하는 이메일',
    exampleDescription: '이메일이 이미 등록되어 있을때 발생하는 에러',
    message: '이미 존재하는 이메일입니다',
    code: 310,
  },
  CHANGE_PW_FAIL: {
    exampleTitle: '비밀번호 변경 실패',
    exampleDescription: '비밀번호 변경에 실패했을때 발생하는 에러',
    message: '비밀번호 변경 실패',
    code: 311,
  },
  PROFILE_UPLOAD_FAIL: {
    exampleTitle: '프로필 업로드 실패',
    exampleDescription: '프로필 업로드에 실패했을때 발생',
    message: '프로필 업로드 실패',
    code: 320,
  },
  DUPLICATED_NICKNAME: {
    exampleTitle: '중복된 닉네임',
    exampleDescription: '닉네임이 중복됐을때 발생',
    message: '중복된 닉네임',
    code: 321,
  },
  PROFILE_NOT_FOUND: {
    exampleTitle: '프로필 없음',
    exampleDescription: '프로필 등록이 안되어있을때 발생',
    message: '프로필 없음',
    code: 322,
  },
  WRONG_PASSWORD2: {
    exampleTitle: '비밀번호 틀림',
    exampleDescription: '비밀번호 틀렸을때',
    message: '비밀번호 틀림',
    code: 325,
  }
};