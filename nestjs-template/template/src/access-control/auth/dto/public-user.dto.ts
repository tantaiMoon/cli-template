import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { SigninUserDto } from '@/access-control/auth/dto/signin-user.dto'

class TestDto {
  @Expose()
  // 配合 enableImplicitConversion 进行类型转换
  @Type(() => String)
  roles: string[]
}

export class PublicUserDto extends SigninUserDto {
  @Exclude()
  password: string

  @Expose()
  username: string

  @Transform(
    ({ obj }) => {
      return obj.roles?.map((item) => ({
        name: item?.name,
        permissions: item?.permissions
      }))
    }
    // { toClassOnly: true }
  )
  @Expose({ name: 'roles' })
  roles: any
}
