import { ValidatorFieldUnique } from '@/common/decorators/validator-field-unique.decorator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreatePermissionDto } from '@/access-control/permission/dto/create-permission.dto'
import { plainToInstance, Transform, Type } from 'class-transformer'
import { CreatePolicyDto } from '@/access-control/policy/dto/create-policy.dto'
import { CreateMenuDto } from '@/access-control/menu/dto/create-menu.dto'
import type { Menu, Policy } from 'prisma/client/mysql'

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

export class CreateRoleRelationsDto {
  @ApiProperty({ description: '角色名称' })
  @IsNotEmpty()
  @IsString()
  @ValidatorFieldUnique('role', 'name')
  name: string

  @ApiProperty({ description: '角色标识' })
  @IsNotEmpty()
  @IsString()
  code: string

  @ApiPropertyOptional({ description: '角色描述' })
  @IsString()
  @IsOptional()
  description: string

  @ApiPropertyOptional({ description: '角色权限' })
  @IsOptional()
  @IsArray()
  @Type(() => CreatePermissionDto)
  /*@Type(() => Permission, {
   discriminator: {
   property: 'type',
   subTypes: [
   { value: StringPermission, name: 'string' },
   { value: DetailedPermission, name: 'detialed' }
   ]
   }
   })*/
  // permission 为 string[] 时，使用 split 分割为 {name, action} 对象数组
  @Transform(
    ({ obj, value }) => {
      return value?.map((item) => {
        if (typeof item === 'string') {
          const parts = item.split(':')
          return plainToInstance(CreatePermissionDto, {
            name: item,
            action: parts[1] ?? ''
          })
        } else {
          return plainToInstance(CreatePermissionDto, item)
        }
      })
    },
    {
      toClassOnly: true
    }
  )
  permissions?: PermissionType[] | string[]

  @ApiPropertyOptional({ description: '角色策略' })
  @IsOptional()
  @IsArray()
  @Type(() => CreatePolicyDto)
  policies?: Policy[] | string[] | number[]

  @ApiPropertyOptional({ description: '角色菜单' })
  @IsOptional()
  @IsArray()
  @Type(() => CreateMenuDto)
  menus?: Menu[]
}
