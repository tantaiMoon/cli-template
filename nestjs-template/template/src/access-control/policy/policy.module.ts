import { UserModule } from '@/user/user.module'
import { Global, Module } from '@nestjs/common'
import { PolicyController } from './policy.controller'
import { CaslAbilityService } from './casl-ability.service'
import { PolicyService } from '../policy/policy.service'

@Global()
@Module({
  controllers: [PolicyController],
  imports: [UserModule],
  providers: [PolicyService, CaslAbilityService],
  exports: [CaslAbilityService, PolicyService]
})
export class PolicyModule {}
