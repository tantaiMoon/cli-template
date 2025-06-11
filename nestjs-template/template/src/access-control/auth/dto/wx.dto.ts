import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class WxSigninDto {
  @ApiProperty({ description: '微信授权code', example: 'code' })
  @IsNotEmpty({ message: i18nValidationMessage('validation:IS_EMPTY', { field: 'code' }) })
  readonly code: string

  @ApiPropertyOptional({ description: 'iv' })
  @IsOptional()
  readonly iv: string

  @ApiPropertyOptional({ description: 'encryptedData' })
  @IsOptional()
  readonly encryptedData: string
}

export class WxSessionDTO {
  openid: string
  session_key: string
}
