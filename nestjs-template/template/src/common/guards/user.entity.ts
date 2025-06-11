import { Exclude, Transform } from 'class-transformer'

export class User {
  username: string

  @Exclude()
  password: string

  email?: string

  phone?: string

  name?: string

  avatar?: string

  @Exclude()
  openid?: string

  sessionKey?: string

  city?: string

  province?: string

  country?: string

  unionid?: string

  age?: number

  @Transform(({ value }) => Number(value))
  status: number

  type: number

  gender?: number

  expired?: Date

  @Exclude()
  @Transform(({ obj }) => {
    return obj?.userRoles?.map((userRole: any) => userRole.role) || []
  })
  userRoles: any[]
}
