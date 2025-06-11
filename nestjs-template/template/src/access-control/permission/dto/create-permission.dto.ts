import { ValidatorFieldUnique } from '@/common/decorators/validator-field-unique.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'

export class CreatePermissionDto {
  @IsOptional()
  @IsInt()
  id?: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '权限名称' })
  @ValidatorFieldUnique('permission', 'name')
  name: string

  @IsNotEmpty()
  @IsString()
  action: string

  @ApiProperty({ description: '角色标识' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  code?: string

  @IsString()
  @IsOptional()
  description: string
}
