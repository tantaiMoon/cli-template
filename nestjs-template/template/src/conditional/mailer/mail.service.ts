import { MailerService } from '@nestjs-modules/mailer'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common'

@Injectable()
export class MailService {
  private readonly logger: Logger = new Logger()
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailerService: MailerService
  ) {}

  async sendEmailCode(params: {
    email: string
    context: any
    subject: string
    from?: string
    text?: string
  }) {
    try {
      const code = Math.floor(Math.random() * 900000 + 100000).toString()
      await this.cacheManager.set(`code_${params.email}`, code, 300)
      await this.mailerService.sendMail({
        to: params.email,
        from: params.from ?? '2106428214@qq.com',
        subject: params.subject, // 邮件主题
        text: params.text,
        template: 'send-mail-code',
        context: params.context
      })
      this.logger.log(`验证码 code: ${code}, 已发送至邮箱：${params.email}`)
      return code
    } catch (e) {
      throw new HttpException('邮件发送失败：' + e.message, 500)
    }
  }

  async sendEmail(params: {
    email: string
    context: any
    subject: string
    template?: string
    from?: string
    text?: string
  }) {
    try {
      const code = Math.floor(Math.random() * 900000 + 100000).toString()
      await this.cacheManager.set(`code_${params.email}`, code, 300)
      await this.mailerService.sendMail({
        to: params.email,
        from: params.from ?? '2106428214@qq.com',
        subject: params.subject, // 邮件主题
        text: params.text ?? 'welcome',
        template: params.template ?? 'default',
        context: params.context
      })
      this.logger.log(`邮件已发送至邮箱：${params.email}`)
      return code
    } catch (e) {
      throw new HttpException('邮件发送失败：' + e.message, 500)
    }
  }
}
