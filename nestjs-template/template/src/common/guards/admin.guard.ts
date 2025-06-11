import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { UserService } from '@/user/user.service'
import { Request } from 'express'
import type { Role } from 'prisma/client/mysql'

/*
 * 装饰器是有执行顺序的
 * 1. 方法参数器如果有多个，则以书写顺序，从下往上(从后往前)执行
 * @UseGuards(AdminGuard)
 * @UseGuards(AuthGuard('jwt'))
 * 2. 如果使用 UseGuards 传递多个守卫，则从前往后执行
 * 如果前面的 Guard 没有通过，后面的就不会执行
 * @UseGuards(AuthGuard('jwt'), AdminGuard)
 *
 * ****全局守卫无法使用依赖注入，需要通过 APP_GUARD 注入
 * */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取请求对象
    const request: Request = context.switchToHttp().getRequest()
    if (request?.user) {
      const { id } = request.user
      console.log('>-----------(admin.guard.ts:26) var is request.user:', request.user)
      let roles: Role[]
      // 通过获取请求对象上的用户信息加入逻辑判断  ---> 角色判断，权限判断
      // req -> headers -> jsonwebtoken -> 解码得到 payload
      const user = await this.userService.findOne(id)
      // eslint-disable-next-line
      roles = (user as any)?.roles
      // console.log('>-----------(admin.guard.ts:30) var is roles:', roles)
      if (roles?.length === 0 || !roles) {
        return false
      }
    }
    return true
  }
}
