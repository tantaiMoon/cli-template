import { Reflector } from '@nestjs/core'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext): Promise<boolean> | boolean | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler())
    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }
}
