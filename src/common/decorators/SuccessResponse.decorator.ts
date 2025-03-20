import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { SuccessCommonResponseDto } from 'common/dtos/SuccessCommonResponse.dto';
import { makeInstanceByApiProperty } from 'common/utils/makeInstanceByApiProperty';
import { mergeObjects } from 'common/utils/mergeTwoObj';

export interface SuccessResponseOption {
  /**
   * 응답 DTO를 지정합니다 (예: UserDto)
   */
  model: Type<any>;
  
  /**
   * 예제의 제목 (예: "User Response Example")
   */
  exampleTitle: string;
  
  /**
   * 응답 값을 덮어씌울 값 (optional)
   */
  overwriteValue?: Record<string, any>;
  
  /**
   * 응답 예제 설명
   */
  exampleDescription: string;
  
  /**
   * 제네릭 타입 지정이 필요한 경우 (optional)
   */
  generic?: Type<any>;
}

/**
 * 여러 응답 값을 쉽게 설정할 수 있는 데코레이터
 * @param StatusCode HTTP 상태 코드 (예: HttpStatus.OK)
 * @param successResponseOptions 여러 개의 응답 예제 옵션 (배열 형태)
 * @returns 데코레이터 적용
 */
export const SuccessResponse = (
  StatusCode: HttpStatus,
  successResponseOptions: SuccessResponseOption[]
) => {

  // console.log('🔍 SuccessResponse 호출됨:', successResponseOptions);
  // 🛑 성공 응답 옵션이 없거나 잘못된 경우 예외 처리
  if (!Array.isArray(successResponseOptions) || successResponseOptions.length === 0) {
    throw new Error('successResponseOptions must be a non-empty array');
  }

  // 🛑 각 옵션이 유효한지 검사
  successResponseOptions.forEach((response) => {
    if (!response || !response.model) {
      throw new Error('Each successResponseOptions item must have a valid model property');
    }
  });

  const examples = successResponseOptions
    .map((response: SuccessResponseOption) => {
      // 기본 응답 DTO 인스턴스 생성
      const commonResponseInstance =
        makeInstanceByApiProperty<SuccessCommonResponseDto<any>>(SuccessCommonResponseDto);

      // 지정된 DTO 인스턴스 생성
      const DtoModel = response.model;
      const dtoData = makeInstanceByApiProperty<typeof DtoModel>(DtoModel, response.generic);

      // 덮어씌울 값이 있으면 반영
      if (response.overwriteValue) {
        commonResponseInstance.data = mergeObjects({}, dtoData, response.overwriteValue);
      } else {
        commonResponseInstance.data = dtoData;
      }

      // 예제 객체 생성
      return {
        [response.exampleTitle]: {
          value: commonResponseInstance,
          description: response.exampleDescription,
        },
      };
    })
    .reduce((result, item) => Object.assign(result, item), {});

  // 스키마 참조 모델 생성
  const extraModels = successResponseOptions.map((e) => e.model) as unknown as Type[];
  const uniqueModels = [...new Set(extraModels)]; // 중복 제거

  // 제네릭 모델 참조 추가
  const extraGenericModels = successResponseOptions
    .map((e) => e.generic)
    .filter(Boolean) as unknown as Type[];
  const uniqueGenericModels = [...new Set(extraGenericModels)];

  // API 데코레이터 적용
  return applyDecorators(
    ApiExtraModels(...uniqueModels, ...uniqueGenericModels, SuccessCommonResponseDto),
    ApiResponse({
      status: StatusCode,
      content: {
        'application/json': {
          schema: {
            additionalProperties: { $ref: getSchemaPath(SuccessCommonResponseDto) },
            oneOf: [...uniqueModels.map((e) => ({ $ref: getSchemaPath(e) })), 
                    ...uniqueGenericModels.map((e) => ({ $ref: getSchemaPath(e) }))],
          },
          examples,
        },
      },
    })
  );
};
