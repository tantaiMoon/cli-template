import { CreateMenuDto } from '@/access-control/menu/dto/create-menu.dto'
import { PartialType } from '@nestjs/mapped-types'
import { CreateRoleDto } from '@/access-control/role/dto/create-role.dto'
import { Expose, Transform, Type } from 'class-transformer'
import { CreatePolicyDto } from '@/access-control/policy/dto/create-policy.dto'
import { CreatePermissionDto } from '@/access-control/permission/dto/create-permission.dto'

export class PublicUpdateRoleDto extends PartialType(CreateRoleDto) {
  @Type(() => CreatePolicyDto)
  @Expose({ name: 'rolePolicies' })
  @Transform(({ value }) => {
    // 暴露除了 encode 之外的属性
    return value?.map((item) => {
      delete item.policy.encode
      delete item.policy.fields_data
      return item.policy
    })
  })
  policies?: CreatePolicyDto

  @Type(() => CreatePermissionDto)
  @Expose({ name: 'rolePermissions' })
  @Transform(({ value }) => {
    // 暴露除了 encode 之外的属性
    return value?.map((item) => {
      // delete item.policy.encode
      return item.permission.name
    })
  })
  permissions?: any

  @Type(() => CreateMenuDto)
  @Expose({ name: 'roleMenus' })
  @Transform(({ value }) => {
    // 暴露除了 encode 之外的属性
    return value?.map((item) => {
      // delete item.policy.encode
      return item.menu
    })
  })
  menus?: any
}
