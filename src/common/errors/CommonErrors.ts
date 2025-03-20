import { ErrorResponseOption } from 'common/decorators/ErrorResponse.decorator';
type Keys =
  | 'INTERNAL_SERVER_ERROR'
  | 'BAD_REQUEST'
  | 'IMAGE_NOT_FOUND'


export const Common: Record<Keys, ErrorResponseOption & { code: number }> = {
  // 공통 에러
  INTERNAL_SERVER_ERROR: {
    exampleTitle: '서버 내부 에러',
    exampleDescription: '서버 내부 에러 시 발생하는 에러',
    message: '서버 에러',
    code: 100,
  },
  BAD_REQUEST: {
    exampleTitle: 'bad request',
    exampleDescription: '요청 값이 이상할때 발생하는 에러',
    message: '[이상한 요청값]',
    code: 104,
  },
  IMAGE_NOT_FOUND: {
    exampleTitle: '이미지 찾을 수 없음',
    exampleDescription: '이미지 조회 못했을떄 발생',
    message: '이미지를 찾을 수 없습니다.',
    code: 103,
  }
};