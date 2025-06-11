import { UserModule } from '@/user/user.module'
import { forwardRef, Module } from '@nestjs/common'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [forwardRef(() => UserModule)],
  exports: [RoleService]
})
export class RoleModule {}
