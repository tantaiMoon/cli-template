import { UserModule } from '@/user/user.module'
import { Module } from '@nestjs/common'
import { PermissionController } from './permission.controller'
import { PermissionService } from '../permission/permission.service'

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
  imports: [UserModule],
  exports: [PermissionService]
})
export class PermissionModule {}
