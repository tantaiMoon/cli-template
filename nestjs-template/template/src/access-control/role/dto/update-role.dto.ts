import { CreateMenuDto } from '@/access-control/menu/dto/create-menu.dto'
import { CreatePermissionDto } from '@/access-control/permission/dto/create-permission.dto'
import { CreatePolicyDto } from '@/access-control/policy/dto/create-policy.dto'
import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { plainToInstance, Transform, Type } from 'class-transformer'
import { IsArray, IsOptional } from 'class-validator'
import { Menu, Policy } from 'prisma/client/mysql'
import { CreateRoleDto } from './create-role.dto'

interface PermissionType {
  id?: number
  name: string
  action: string
  description?: string
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiPropertyOptional({ description: '角色权限' })
  @IsOptional()
  @IsArray()
  @Type(() => CreatePermissionDto)
  // permission 为 string[] 时，使用 split 分割为 {name, action} 对象数组
  @Transform(
    ({ value }) => {
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
