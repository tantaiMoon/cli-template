import { MailerService } from '@nestjs-modules/mailer'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { Controller, Get, Inject, Version } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller()
export class AppController {
  // TODO 对应 app.module 中的注释
  //  获取 DI 中具体的 class 类的实例以及他们之间的依赖关系
  constructor(
    @Inject(CACHE_MANAGER) private cachemanager: Cache,
    private readonly mailerService: MailerService
  ) {}

  @ApiOperation({
    summary: '测试接口'
  })
  @Get()
  @Version('1')
  async getHello() {
    let test: number = (await this.cachemanager.get('test')) ?? 0
    test += 1
    await this.cachemanager.set('test', test)
    const cacheTest = await this.cachemanager.get('test')
    return {
      cacheTest: cacheTest,
      message: 'moyi-be is running'
    }
  }

  @Get('version')
  async getVersion() {
    const version = process.env.APP_VERSION
    const res = await this.cachemanager.get('version')
    await this.cachemanager.set('version', res || version)
    return {
      version
    }
  }

  @ApiOperation({
    summary: '测试发送邮件'
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
    type: Object,
    example: {
      message: 'test send Mail',
      code: 0
    }
  })
  @Get('test/mail')
  async sendMail() {
    await this.mailerService.sendMail({
      to: 'tantaiqiuyue@gmail.com',
      from: '2106428214@qq.com',
      subject: 'Testing Nest MailerModule ✔', // 邮件主题
      text: 'welcome',
      template: 'default',
      context: {
        name: 'moyi',
        title: 'Test send Mail',
        message: 'test send Mail'
      }
    })
    return {
      message: 'test send Mail',
      code: 0
    }
  }
}
