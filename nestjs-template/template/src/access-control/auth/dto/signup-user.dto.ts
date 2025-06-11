import { SigninUserDto } from './signin-user.dto'
import { ValidatorFieldUnique } from '@/common/decorators/validator-field-unique.decorator'
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator'
import { Transform } from 'class-transformer'
import { i18nValidationMessage } from 'nestjs-i18n'

export class SignupUserDto extends SigninUserDto {
  @IsNotEmpty({
    message: '用户名不能为空'
  })
  @IsString()
  @Length(5, 20, {
    message: ({ constraints, property, value }) => {
      return `用户名长度必须是 ${constraints[0]}- ${constraints[1]} 位字符`
    }
  })
  @ValidatorFieldUnique('user', 'username', {
    message: i18nValidationMessage('validation.IS_EXISTS', { property: 'username' })
  })
  username: string

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
