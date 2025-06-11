import { PartialType } from '@nestjs/mapped-types'
import { CreatePermissionDto } from '@/access-control/permission/dto/create-permission.dto'
import { CreatePolicyDto } from '@/access-control/policy/dto/create-policy.dto'
import { Expose, Transform, Type } from 'class-transformer'

export class PublicUpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @Type(() => CreatePolicyDto)
  @Expose({ name: 'permissionPolicies' })
  @Transform(({ value }) => {
    // 暴露除了 encode 之外的属性
    return value.map((item) => {
      delete item.policy.encode
      return item
    })
  })
  policies?: CreatePolicyDto
}
