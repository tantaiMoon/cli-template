import { ValidatorFieldUnique } from '@/common/decorators/validator-field-unique.decorator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreatePermissionDto } from '@/access-control/permission/dto/create-permission.dto'
import { plainToInstance, Transform, Type } from 'class-transformer'
import { CreatePolicyDto } from '@/access-control/policy/dto/create-policy.dto'
import { CreateMenuDto } from '@/access-control/menu/dto/create-menu.dto'

interface PermissionType {
  id?: number
  name: string
  action: string
  description?: string
}

abstract class Permission {
  abstract type: string
}

abstract class StringPermission extends Permission {
  type = 'string'
  value: string
}

abstract class DetailedPermission extends Permission {
  type = 'detailed'
  name: string
  action: string
}

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsNotEmpty()
  @IsString()
  @ValidatorFieldUnique('Role', 'name')
  name: string

  @ApiProperty({ description: '角色标识' })
  @IsNotEmpty()
  @IsString()
  code: string

  @ApiPropertyOptional({ description: '角色描述' })
  @IsString()
  @IsOptional()
  description: string
}
