import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    // 获取请求上下文
    const request: Request = ctx.getRequest()
    // 获取响应上下文
    const response: Response = ctx.getResponse()
    // 错误状态码
    const status = exception.getStatus() as number
    this.logger.error(exception.message, exception.stack)
    // 错误信息
    const message = exception.message as string
    // 响应
    response.status(status).json({
      code: -1,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      success: false
    })
  }
}
