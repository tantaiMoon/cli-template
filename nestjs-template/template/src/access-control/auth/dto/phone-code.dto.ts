import { ApiProperty } from '@nestjs/swagger'
import { IsMobilePhone, IsNotEmpty, IsString } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class PhoneCodeDto {
  @ApiProperty()
  @IsMobilePhone(
    'zh-CN',
    {},
    {
      message: i18nValidationMessage('validation.INVALID_PHONE', { property: 'phone' })
    }
  )
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY', { property: 'phone' })
  })
  @IsString({
    message: i18nValidationMessage('validation.IS_STRING', { property: 'phone' })
  })
  phone: string
}
