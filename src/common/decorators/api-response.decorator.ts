import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';

export function ApiResponse<TModel extends Type<any>>(model: TModel) {
  return applyDecorators(
    ApiOkResponse({ type: model }),
    ApiBadRequestResponse({ description: 'Bad Request' }),
    ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
  );
} 