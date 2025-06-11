import { CodeSigninDto, SigninUserDto } from './dto/signin-user.dto'
import { SignupUserDto } from './dto/signup-user.dto'
import { ConfigurationService } from '@/common/configuration/configuration.service'
import { ConfigEnum } from '@/common/enums/config.enum'
import { MailService } from '@/conditional/mailer/mail.service'
import { SmsService } from '@/conditional/sms/sms.service'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  Logger
} from '@nestjs/common'
import { UserService } from '@/user/user.service'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import type { User } from 'prisma/client/mysql'
import { catchError, lastValueFrom } from 'rxjs'
import svgCaptcha from 'svg-captcha'
import { WxSessionDTO, WxSigninDto } from './dto/wx.dto'
import WXBizDataCrypt from '@/utils/wx-biz-data-crypt'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger()
  constructor(
    private userService: UserService,
    private configService: ConfigurationService,
    private mailService: MailService,
    private httpService: HttpService,
    private smsService: SmsService,
    @Inject(CACHE_MANAGER) private cacheManger: Cache,
    private jwtService: JwtService
  ) {}

  private createCaptcha(opts: svgCaptcha.ConfigObject = {}) {
    const defaultConfig = {
      color: true, // 彩色
      //inverse:false,// 反转颜色
      width: 200, //  宽度
      height: 80, // 高度
      fontSize: 56, // 字体大小
      size: 4, // 验证码的长度
      noise: 3, // 干扰线条
      ignoreChars: '0oO1ilI' // 验证码字符中排除 0o1
    }
    const captcha = svgCaptcha.create({
      ...defaultConfig,
      ...opts
    })
    return captcha
  }

  async logout(userId: number) {
    await this.cacheManger.del('refresh_token__' + userId)
    await this.cacheManger.del('token__' + userId)
    return true
  }

  async getCaptcha() {
    // const captchaKey = uuidv4()
    const captchaCode = this.createCaptcha()
    const captchaKey = this.createCaptcha({
      size: 12 // 验证码的长度
    })
    await this.cacheManger.set(
      'user__captcha__' + captchaKey.text,
      captchaCode.text.toLowerCase(),
      5 * 60 * 1000 // 5 min
    )
    return {
      captcha: captchaCode.data,
      captchaKey: captchaKey.text
    }
  }

  async signin(dto: SigninUserDto, captchaKey: string) {
    const { username, password, captcha } = dto
    const user = await this.userService.findOneBy(username)
    console.log('>-----------(auth.service.ts:82) var is user:', user)
    if (!user) {
      throw new ForbiddenException('用户不存在')
    }
    const cacheCaptcha = await this.cacheManger.get<string>('user__captcha__' + captchaKey)
    if (captcha?.toLowerCase() !== cacheCaptcha?.toLowerCase()) {
      throw new BadRequestException('验证码错误')
    }
    await this.cacheManger.del('user__captcha__' + captchaKey)
    const isPassword = await argon2.verify(user.password, password)
    if (!isPassword) {
      throw new ForbiddenException('用户名或密码错误')
    }
    const token = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username
    })
    // await this.cacheManger.set('token__' + user.id, token, 60 * 60 * 24 * 30 * 1000) // 30d
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        username: user.username
      },
      {
        expiresIn: this.configService.getKey(ConfigEnum.JWT_EXPIRES_REFRESH)
      }
    )
    await this.cacheManger.set(
      'refresh_token__' + user.id,
      {
        username: user.username,
        id: user.id,
        refreshToken
      },
      60 * 60 * 24 * 30 * 1000 // 30d
    )
    return {
      token: {
        access_token: token,
        refresh_token: refreshToken
      },
      user
    }
  }

  async signup(userDto: SignupUserDto, captchaKey: string) {
    const { username, password, roleIds, captcha } = userDto
    const cacheCaptcha = await this.cacheManger.get<string>('user__captcha__' + captchaKey)
    if (captcha?.toLowerCase() !== cacheCaptcha?.toLowerCase()) {
      throw new BadRequestException('验证码错误')
    }
    await this.cacheManger.del('user__captcha__' + captchaKey)
    const user = await this.userService.findOneBy(username)
    if (user) {
      throw new BadRequestException('用户名已存在')
    }
    return this.userService.create({ username, password: await argon2.hash(password), roleIds })
  }

  async codeSignin(dto: CodeSigninDto) {
    const { phone, code, type, email } = dto
    const key = `code__${type === 1 ? email : phone}`
    const codeCache = await this.cacheManger.get<string>(key)
    if (!codeCache) {
      throw new ForbiddenException('验证码已过期')
    }
    if (code !== codeCache) {
      throw new ForbiddenException('验证码错误')
    }
    const user = await this.userService.findOneBy(
      type === 1 ? email : phone,
      type === 1 ? 'email' : 'phone'
    )
    if (!user) {
      throw new ForbiddenException('用户不存在')
      // user = await this.userService.create({
      //   username: type === 1 ? email : phone,
      //   email: email,
      //   phone: phone
      // })
    }
    const token = await this.generateToken(user)
    return {
      access_token: token,
      user: user
    }
  }

  private async generateToken(user: { username: string; id: number }) {
    return await this.jwtService.signAsync({
      sub: user.id,
      username: user.username
    })
  }

  async sendEmailCode(userDto: { username?: string; email: string; ip: string }) {
    const { email } = userDto
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    await this.cacheManger.set(`code__${email}`, code, 3000) // 邮箱和验证码发送到redis中，时间为5分钟
    await this.mailService.sendEmailCode({
      email,
      from: '2106428214@qq.com',
      subject: '邮箱验证码', // 邮件主题
      text: '邮箱验证码',
      context: {
        email,
        title: '邮箱服务',
        code,
        ip: userDto.ip
      }
    })
    return true
  }

  async sendPhonelCode(userDto: { username?: string; phone: string; ip: string }) {
    const { phone } = userDto
    const code = await this.smsService.sendSmsCode(phone)
    console.log('>-----------(auth.service.ts:111) var is code:', code)
    return true
  }

  getUserProfile(encrytedData: string, iv: string, sessionKey) {
    const pc = new WXBizDataCrypt(this.configService.getKey(ConfigEnum.WX_APPID), sessionKey)
    return pc.decryptData(encrytedData, iv)
  }

  async wxLogin(wxAuthenticationDTO: WxSigninDto) {
    const code = wxAuthenticationDTO.code
    const { encryptedData, iv } = wxAuthenticationDTO
    const appId = this.configService.getKey(ConfigEnum.WX_APPID)
    const secret = this.configService.getKey(ConfigEnum.WX_SECRET)

    const wxSessionDTO = await this.code2Session(appId, secret, code)
    console.log(wxSessionDTO, 'wxSessionDTO')
    if (wxSessionDTO.openid == null) {
      this.logger.error('获取openid出现错误')
      throw new HttpException('获取openid出现错误，请稍后重试', 500)
    }
    const { openid, session_key } = wxSessionDTO
    const { nickName, gender, avatarUrl, city, province, country } = await this.getUserProfile(
      encryptedData,
      iv,
      session_key
    )
    console.log(nickName)
    //TODO 暂时只有openid，后续需要获取unionId
    let user = (await this.userService.findOneBy(openid, 'openid')) as User
    if (!user) {
      user = await this.userService.create({
        openid,
        username: nickName,
        sessionKey: session_key,
        name: nickName,
        gender,
        avatar: avatarUrl,
        city,
        province,
        country
      })
    }

    //根据user生成token 返回给前端
    const token = await this.generateToken(user!)
    this.logger.log(`token: ${JSON.stringify(token)}`)
    // 将用户信息和 Token 存入 Redis 中，设置 1 小时过期时间
    const redisKey = `user__${user!.id}`
    const redisValue = { user, role: (user as any).roles }

    await this.cacheManger.set(
      redisKey,
      JSON.stringify(redisValue),
      parseInt(this.configService.getKey(ConfigEnum.JWT_EXPIRES), 10) * 60
    ) // 设置 3600 秒（1 小时）过期时间

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user!.id,
        username: user!.username
      },
      {
        expiresIn: this.configService.getKey(ConfigEnum.JWT_EXPIRES_REFRESH)
      }
    )
    await this.cacheManger.set(
      'refresh_token__' + user!.id,
      {
        username: user!.username,
        id: user!.id,
        refreshToken
      },
      60 * 60 * 24 * 30 * 1000 // 30d
    )

    return {
      access_token: token,
      user: user
    }
  }

  async code2Session(appId: string, secret: string, code: string): Promise<WxSessionDTO> {
    const apiUrl = 'https://api.weixin.qq.com/sns/jscode2session'
    // 使用 params 属性传递参数
    const params = {
      appid: appId,
      secret: secret,
      js_code: code,
      grant_type: 'authorization_code'
    }
    const { data } = await lastValueFrom(
      this.httpService.get<WxSessionDTO>(apiUrl, { params: params }).pipe(
        catchError((err) => {
          this.logger.error(`${err}`)
          throw new HttpException(err.response?.data?.msg, 200)
        })
      )
    )
    return data
  }

  async refreshToken(refreshToken: string) {
    const user: any = await this.jwtService.verifyAsync(refreshToken)
    const cacheData = await this.cacheManger.get('refresh_token__' + user.sub)
    if (!cacheData) {
      throw new ForbiddenException('令牌已失效，请重新登录')
    }
    const token = await this.jwtService.signAsync({
      sub: user.sub,
      username: user.username
    })
    return {
      access_token: token,
      refresh_token: refreshToken
    }
  }
}
