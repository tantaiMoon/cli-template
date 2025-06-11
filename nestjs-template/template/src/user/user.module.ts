import { RoleModule } from '@/access-control/role/role.module'
import { forwardRef, Global, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Global()
@Module({
  imports: [forwardRef(() => RoleModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
