import { ValidatorFieldUnique } from '@/common/decorators/validator-field-unique.decorator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf
} from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
    type: String,
    required: true,
    minLength: 4,
    maxLength: 20
  })
  @IsString()
  @MaxLength(30)
  @MinLength(4)
  @IsNotEmpty()
  @ValidatorFieldUnique('user', 'username', {
    message: i18nValidationMessage('validation.IS_EXISTS', { property: 'username' })
  })
  username: string

  @ApiProperty({
    description: '密码',
    example: 'admin@1234567876543',
    type: String,
    required: true,
    minLength: 6,
    maxLength: 30
  })
  @IsString()
  @MaxLength(30)
  @MinLength(6)
  // @Exclude()
  @IsOptional()
  @ValidateIf((o) => !o.openid)
  password?: string

  @ApiPropertyOptional({
    description: '邮箱',
    example: 'admin@1234567876543',
    type: String,
    required: false
  })
  @IsEmail()
  @IsOptional()
  @IsString()
  email?: string

  @ApiPropertyOptional({
    description: 'openid',
    example: '',
    type: String,
    required: false
  })
  @IsEmail()
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.password)
  openid?: string
  @ApiPropertyOptional({
    description: '微信 sessionKey',
    example: '',
    type: String,
    required: false
  })
  sessionKey?: string

  @ApiPropertyOptional({
    description: '',
    example: '',
    type: String,
    required: false
  })
  city?: string

  @ApiPropertyOptional({
    description: '',
    example: '',
    type: String,
    required: false
  })
  province?: string

  @ApiPropertyOptional({
    description: '',
    example: '',
    type: String,
    required: false
  })
  country?: string

  @ApiPropertyOptional({
    description: '用户名',
    example: '名字',
    type: String,
    required: false
  })
  name?: string

  @ApiPropertyOptional({
    description: '头像',
    example: '',
    type: String,
    required: false
  })
  avatar?: string

  @ApiPropertyOptional({
    description: '性别， 0-男，1-女，2-未知',
    example: 2,
    type: Number,
    required: false
  })
  gender?: number

  @ApiPropertyOptional({
    description: '年龄',
    example: 22,
    type: Number,
    required: false,
    minimum: 0,
    maximum: 200
  })
  @IsNumber()
  @IsOptional()
  @Max(200)
  @Min(0)
  age?: number

  @ApiPropertyOptional({
    description: '手机号',
    example: '13000000000',
    type: String,
    required: false,
    minLength: 11,
    maxLength: 11
  })
  @IsString()
  @IsOptional()
  @MaxLength(11)
  @MinLength(11)
  phone?: string

  @ApiPropertyOptional({ description: '角色', type: [Number] })
  @IsOptional()
  @IsArray()
  @IsNumber(
    {},
    {
      each: true // 用户角色嵌套数据参数都为 number 类型
    }
  )
  @Transform(({ value }) => value.map(Number)) // 使用 Transform 装饰器将所有数据都转化为 number
  roleIds?: number[]
}
