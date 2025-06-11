import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class MailCodeDto {
  @ApiProperty()
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validation.INVALID_EMAIL', { property: 'email' })
    }
  )
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY', { property: 'email' })
  })
  @IsString({
    message: i18nValidationMessage('validation.IS_STRING', { property: 'email' })
  })
  email: string
}
