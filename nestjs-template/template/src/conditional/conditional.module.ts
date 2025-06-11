import { Module } from '@nestjs/common'
import { ConfigEnum } from '@/common/enums/config.enum'
import { getEnvs, toBoolean } from '@/utils'
import { CacheCommonModule } from './cache/cache-common.module'
import { MailerCommonModule } from './mailer/mailer.module'
import { RedisCommonModule } from './cache/redis-common.module'
import { I18nCommonModule } from './i18n/i18n.module'
import { SmsCommonModule } from './sms/sms.module'

const imports: any[] = []
const providers = []
const exportService = []

@Module({})
export class ConditionalModule {
  static register() {
    const parsedConfig = getEnvs()
    // 缓存模块
    imports.push(CacheCommonModule)
    // redis模块
    imports.push(RedisCommonModule)
    // 短信模块
    imports.push(SmsCommonModule)
    // 邮件模块
    if (toBoolean(parsedConfig[ConfigEnum.MAIL_ON])) {
      imports.push(MailerCommonModule)
    }
    // 国际化模块
    if (toBoolean(parsedConfig[ConfigEnum.APP_I18N])) {
      imports.push(I18nCommonModule)
    }
    // 定时任务模块
    if (toBoolean(parsedConfig[ConfigEnum.QUEUE_ON])) {
      // imports.push(QueueModule.register())
    }
    if (toBoolean(parsedConfig[ConfigEnum.CRON_ON])) {
      // imports.push(TasksModule)
      // imports.push(
      //   SshModule.forRootAsync({
      //     inject: [ConfigurationService],
      //     useFactory: (configurationService: ConfigurationService) => {
      //       return {
      //         host: configurationService.getKey(ConfigEnum.SSH_HOST),
      //         username: configurationService.getKey(ConfigEnum.SSH_USERNAME),
      //         password: configurationService.getKey(ConfigEnum.SSH_PASSWORD),
      //         port: configurationService.getKey<number>(ConfigEnum.SSH_PORT)
      //       }
      //     }
      //   })
      // )
    }
    return {
      module: ConditionalModule,
      imports: imports,
      providers: providers,
      exports: exportService
    }
  }
}
