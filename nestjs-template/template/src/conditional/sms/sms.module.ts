import { Global, Module } from '@nestjs/common'
import { SmsService } from './sms.service'

@Global()
@Module({
  imports: [],
  exports: [SmsService],
  providers: [SmsService]
})
export class SmsCommonModule {}
