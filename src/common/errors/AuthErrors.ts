import { ErrorResponseOption } from '../decorators/ErrorResponse.decorator';
type Keys = 'SOCIAL_SIGNUP_FAIL' | 'SOCIAL_LOGIN_FAIL';

export const Auth: Record<Keys, ErrorResponseOption & { code: number }> = {
  SOCIAL_SIGNUP_FAIL: {
    exampleTitle: '소셜 회원가입 실패',
    exampleDescription: '소셜 회원가입 실패 했을때 발생하는 에러',
    message: '소셜 회원가입 실패',
    code: 201,
  },

  SOCIAL_LOGIN_FAIL: {
    exampleTitle: '소셜 로그인 실패',
    exampleDescription: '소셜 로그인 실패했을때 발생하는 에러',
    message: '소셜 로그인 실패',
    code: 210,
  },
};