import { ValidatorFieldUnique } from '@/common/decorators/validator-field-unique.decorator'
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateIf
} from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { i18nValidationMessage } from 'nestjs-i18n'

export class SigninUserDto {
  @IsNotEmpty({
    message: '用户名不能为空'
  })
  @IsString()
  @Length(5, 20, {
    message: ({ constraints }) => {
      return `用户名长度必须是 ${constraints[0]}- ${constraints[1]} 位字符`
    }
  })
  username: string

  @IsNotEmpty({
    message: '密码不能为空'
  })
  @IsString()
  @Length(6, 30, {
    message: ({ constraints }) => {
      return `密码长度必须是 ${constraints[0]}- ${constraints[1]} 位字符`
    }
  })
  password: string

  @IsNotEmpty({
    message: '验证码不能为空'
  })
  @IsString()
  @Length(4, 4, {
    message: ({ constraints }) => {
      return `验证码长度必须是 ${constraints[0]}- ${constraints[1]} 位字符`
    }
  })
  captcha: string

  @IsOptional()
  @IsArray()
  @IsNumber(
    {},
    {
      each: true // 用户角色嵌套数据参数都为 number 类型
    }
  )
  @Transform(({ value }) => +value) // 使用 Transform 装饰器将所有数据都转化为 number
  roleIds?: number[]
}

export class CodeSigninDto {
  @ApiProperty({ description: '登录类型', example: 1 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsInt()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_EMPTY', { field: 'type' }) })
  readonly type: number

  @ValidateIf((o) => o.type === 1, { message: '邮箱不能为空' })
  readonly email: string

  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString()
  @Length(6, 6, { message: '验证码长度必须是 6 位字符' })
  readonly code: string

  @ValidateIf((o) => o.type === 2, { message: '手机号不能为空' })
  readonly phone: string
}
