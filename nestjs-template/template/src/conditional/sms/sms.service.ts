import { ConfigurationService } from '@/common/configuration/configuration.service'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common'
import * as tencentcloud from 'tencentcloud-sdk-nodejs'

@Injectable()
export class SmsService {
  private smsClient
  private readonly logger: Logger = new Logger()

  constructor(
    private configService: ConfigurationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    this.smsClient = new tencentcloud.sms.v20210111.Client({
      credential: {
        secretId: this.configService.getKey('SMS_SECRET_ID'),
        secretKey: this.configService.getKey('SMS_SECRET_KEY')
      },
      region: this.configService.getKey('SMS_REGION')
    })
  }

  async sendSmsCode(phone: string) {
    const code = Math.floor(Math.random() * 900000 + 100000).toString()
    await this.cacheManager.set(`code_${phone}`, code, 300)
    const params = {
      SmsSdkAppId: this.configService.getKey('SMS_APP_ID'), // 短信应用 ID: 短信SdkAppId在 [短信控制台] 添加应用后生成的实际SdkAppId，示例如1400006666
      SignName: this.configService.getKey('SMS_SIGN_NAME'), // 短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名，签名信息可登录 [短信控制台] 查看
      TemplateId: this.configService.getKey('SMS_TEMPLATE_ID'), // 短信模板 ID: 必须填写已审核通过的模板 ID，模板ID可登录 [短信控制台] 查看
      TemplateParamSet: [code, 5], // 模板参数: 若无模板参数，则设置为空
      PhoneNumberSet: [`+86${phone}`] // 下发手机号码，采用 E.164 标准，+[国家或地区码][手机号]
      // 例如+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号
    }
    const result = await this.smsClient.SendSms(params)
    result.SendStatusSet.forEach((status) => {
      if (status.Code !== 'Ok') {
        throw new HttpException('短信发送失败：' + status.message, 500)
      }
    })
    this.logger.log(`验证码 code: ${code}, 已发送至手机号：${phone}`)
    return code
  }
}
