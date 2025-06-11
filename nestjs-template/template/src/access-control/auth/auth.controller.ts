import { ApiResult } from '@/common/decorators/api-result.decorator'
import { FieldUniqueValidationPipe } from '@/common/pipes/unique-validation.pipe'
import { Body, Controller, Post, Req, Res, Session, UsePipes, Headers } from '@nestjs/common'
import { ApiBody, ApiOperation } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { CodeSigninDto, SigninUserDto } from './dto/signin-user.dto'
import { CreateUserPipe } from './pipes/create-user.pipe'
import { PublicUserDto } from './dto/public-user.dto'
import { Serialize } from '@/common/decorators/serialze.decorator'
import { Request, Response } from 'express'
import { WxSigninDto } from './dto/wx.dto'
import { SignupUserDto } from './dto/signup-user.dto'

@Controller('auth')
@UsePipes(FieldUniqueValidationPipe)
export class AuthController {
  constructor(private authService: AuthService) {}

  // 登录
  @ApiOperation({ summary: '用户登录', description: '账号密码登录' })
  @ApiResult({ type: Object, status: 200, description: '返回用户信息及token' })
  @ApiBody({ type: SigninUserDto, description: '用户登录信息' })
  @Post('signin')
  @Serialize(PublicUserDto)
  signin(@Body() dto: SigninUserDto, @Headers('captcha-key') captchaKey: string) {
    return this.authService.signin(dto, captchaKey)
  }

  // wechat 登录
  @ApiOperation({ summary: '微信授权登录', description: '微信授权登录，关联微信账号' })
  @ApiResult({ type: Object, status: 200, description: '返回用户信息及token' })
  @ApiBody({ type: WxSigninDto, description: '用户登录信息' })
  @Post('wechat/signin')
  @Serialize(PublicUserDto)
  wechatSignin(@Body() dto: WxSigninDto) {
    return this.authService.wxLogin(dto)
  }

  // 获取邮箱验证码
  @ApiOperation({ summary: '获取邮箱验证码', description: '发送邮箱验证码' })
  @ApiResult({ type: Boolean, status: 200, description: '是否发送成功' })
  @Post('send/email')
  async getEmailCode(@Session() session, @Req() req, @Body() body: any) {
    // SendEmailCodeDto
    await this.authService.sendEmailCode({
      email: body.email,
      ip: req.ip
    })
    return true
  }

  // 获取手机验证码
  @ApiOperation({ summary: '获取手机验证码', description: '发送手机验证码' })
  @ApiResult({ type: Boolean, status: 200, description: '是否发送成功' })
  @Post('send/phone')
  async getPhoneCode(@Session() session, @Req() req, @Body() body: any) {
    // SendEmailCodeDto
    await this.authService.sendPhonelCode({
      phone: body.phone,
      ip: req.ip
    })
    return true
  }

  // 验证码登录
  @ApiOperation({ summary: '验证码登录', description: '验证码登录' })
  @ApiResult({ type: Object, status: 200, description: '登录成功' })
  @Post('code/signin')
  async verifyCodeLogin(@Body() body: CodeSigninDto) {
    return this.authService.codeSignin(body)
  }

  @Post('signup')
  @Serialize(PublicUserDto)
  async signup(
    @Body(CreateUserPipe) dto: SignupUserDto,
    @Headers('captcha-key') captchaKey: string
  ) {
    const user = await this.authService.signup(dto, captchaKey)
    return user
  }

  @Post('logout')
  @Serialize(PublicUserDto)
  async logout(@Req() req: Request) {
    const { id } = req.user
    await this.authService.logout(id)
    return true
  }

  @Post('captcha')
  async getCaptcha(@Res() res: Response) {
    const { captcha, captchaKey } = await this.authService.getCaptcha()
    res.type('svg')
    res.setHeader('captcha-key', captchaKey)
    res.send(captcha)
  }

  /*@Get('qrcode')
   async generateQrCode(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
   // 为二维码生成一个随机的token
   const token = this.utilityService.generateRandomString()
   await this.redisService.set(`qrcode_login:${token}`, QRCODE_STATUS.PENDING, 300)
   const hostname = req.hostname
   const port = req.socket.localPort
   const protocol = req.protocol
   const qrCodeUrl = `${protocol}://${hostname}:${port}/api/auth/qrcode/scan?token=${token}`
   this.winstonService.log(qrCodeUrl)
   const qrCode = await qrcode.toDataURL(qrCodeUrl)
   return {
   token,
   qrCode
   }
  }

   @Get('qrcode/scan')
   async scanQrCode(@Res() res: Response, @Query('token') token: string) {
   // 为二维码生成一个随机的token
   await this.redisService.set(`qrcode_login:${token}`, QRCODE_STATUS.SCANNED, 300)
   res.redirect(`/app_authorization.html?token=${token}`)
  }

   @Get('qrcode/check/status')
   async checkQrCodeStatus(@Query('token') token: string) {
   try {
   // 为二维码生成一个随机的token
   const status = await this.redisService.get(`qrcode_login:${token}`)
   if (!status) {
   return {
   status: QRCODE_STATUS.EXPIRED
   }
   }
   if (status === QRCODE_STATUS.AUTHORIZED) {
   const userId = await this.redisService.get(`qrcode_login_user:${token}`)
   const user = await this.userService.findOne({ where: { id: Number(userId) } })
   if (!user) {
   throw '用户不存在'
   }
   const tokens = await this.authService.generateToken(user)
   return {
   status,
   user,
   token: tokens
   }
   }
   return { status }
   } catch (e) {
   throw new HttpException(e, e.status ?? 200)
   }
  }

   @Post('qrcode/deny')
   async denyQrCode(@Query('token') token: string) {
   // 为二维码生成一个随机的token
   await this.redisService.set(`qrcode_login:${token}`, QRCODE_STATUS.DENIED, 300)
   return {
   success: true,
   data: true,
   message: '已拒绝授权'
   }
  }

   @Post('qrcode/authorize')
   async authorizeQrCode(@Query('token') token: string, @Body() body: any) {
   try {
   const currentStatus = await this.redisService.get(`qrcode_login:${token}`)
   console.log(await this.redisService.get(`qrcode_login:${token}`))
   if (currentStatus !== QRCODE_STATUS.SCANNED) {
   throw new BadRequestException('二维码未扫码或者已过期')
   }
   if (!body.appAccessToken) {
   throw new BadRequestException('用户信息错误')
   }
   const decodeUser = await this.jwtService.verifyAsync(body.appAccessToken, {
   secret: this.configurationService.jwtSecret
   })
   await this.redisService.set(`qrcode_login:${token}`, QRCODE_STATUS.AUTHORIZED, 300)
   await this.redisService.set(`qrcode_login_user:${token}`, decodeUser.id, 300)
   return {
   data: true,
   message: '授权成功'
   }
   } catch (e) {
   throw new HttpException(e, e?.status || 200)
   }
   }*/
}
