import 'reflect-metadata'
import { type ValidationOptions } from 'class-validator'

export const UNIQUE_FIELD_METADATA = 'UNIQUE_FIELD_METADATA'
// 获取需要验证唯一性的字段
// 这可以通过元数据、反射或配置来实现
export function getUniqueFields(dto: object): Array<{ field: string; schema: string }> {
  if (!dto) {
    return []
  }
  // 这里根据实际情况定义唯一字段
  const dtoClass = dto.constructor
  const uniqueFields: Array<Record<string, any>> =
    Reflect.getMetadata(UNIQUE_FIELD_METADATA, dtoClass) || []

  return uniqueFields.map((field) => ({
    field: field.field,
    schema: field.schema
  }))
}

export function ValidatorFieldUnique(
  schema: string,
  property: string,
  options?: ValidationOptions
) {
  return function (target: object, propertyKey: string) {
    const existingFields = Reflect.getMetadata(UNIQUE_FIELD_METADATA, target.constructor) || []

    Reflect.defineMetadata(
      UNIQUE_FIELD_METADATA,
      [
        ...existingFields,
        {
          field: property || propertyKey,
          schema: schema,
          propertyKey,
          options
        }
      ],
      target.constructor
    )
  }
}
