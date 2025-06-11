import { MailService } from '@/conditional/mailer/mail.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Global, Module } from '@nestjs/common'
import { ConfigurationService } from '@/common/configuration/configuration.service'
import { ConfigEnum } from '@/common/enums/config.enum'

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => {
        const fromMail = configurationService.getKey(ConfigEnum.SMTP_USER)
        const host = configurationService.getKey(ConfigEnum.SMTP_HOST)
        const passwd = configurationService.getKey(ConfigEnum.SMTP_PASS)
        const port = configurationService.getKey(ConfigEnum.SMTP_PORT)
        return {
          transport: `smtps://${fromMail}:${passwd}@${host}`,
          defaults: {
            from: `"Moyi-be" <${fromMail}>`
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true
            }
          }
        }
      }
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailerCommonModule {}
