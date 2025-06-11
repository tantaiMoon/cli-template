import { Exclude, Transform } from 'class-transformer'
import { CreateUserDto } from './create-user.dto'

export class PublicUserDto extends CreateUserDto {
  @Exclude()
  password: string

  @Transform(({ value }) => {
    return value
      ?.map((item) =>
        item?.role
          ? {
              name: item.role.name,
              roleId: item.role.id,
              roleCode: item.role.code,
              permissions: item.role.rolePermissions?.map((p) => p.permission.name)
            }
          : null
      )
      ?.filter(Boolean)
  })
  roles?: any[]
}
