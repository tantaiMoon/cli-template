import { Result } from '@/common/interceptors/transform.interceptor'
import { applyDecorators, HttpStatus, Type } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger'

const baseTypeNames = ['String', 'Number', 'Boolean']

export const ApiResult = <TModel extends Type<any>>({
  type,
  isPage,
  status,
  ...other
}: {
  type?: TModel | TModel[]
  isPage?: boolean
  status?: HttpStatus
} & ApiResponseOptions) => {
  let prop: any = null
  if (Array.isArray(type)) {
    if (isPage) {
      prop = {
        type: 'object',
        properties: {
          records: {
            type: 'array',
            items: { $ref: getSchemaPath(type[0]) }
          },
          pagination: {
            type: 'object',
            properties: {
              size: { type: 'number', default: 10 },
              total: { type: 'number', default: 0 },
              pages: { type: 'number', default: 0 },
              page: { type: 'number', default: 0 }
            }
          }
        }
      }
    } else {
      prop = {
        type: 'array',
        items: { $ref: getSchemaPath(type[0]) }
      }
    }
  } else if (type) {
    if (type && baseTypeNames.includes(type.name)) {
      prop = { type: type.name.toLocaleLowerCase() }
    } else {
      prop = { $ref: getSchemaPath(type) }
    }
  } else {
    prop = { type: null, default: null }
  }
  const model = Array.isArray(type) ? type[0] : type
  const decoratorss = [
    ApiExtraModels(model || Result),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(Result) },
          {
            properties: { data: prop }
          }
        ]
      },
      ...other
    })
  ]
  if (type) {
    // decoratorss.unshift(ApiExtraModels(model))
  }
  return applyDecorators(...decoratorss)
}
