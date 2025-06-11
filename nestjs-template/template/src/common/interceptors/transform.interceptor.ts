import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import type { Response } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { ApiProperty } from '@nestjs/swagger'

dayjs.extend(utc)
dayjs.extend(timezone)

export class Result<T = any> {
  @ApiProperty({ description: '是否成功返回', example: true, required: false })
  public success: boolean
  @ApiProperty({ description: '操作或者错误的消息', example: '操作成功' })
  public message: string
  @ApiProperty({ description: '返回的 code（0表示成功返回）', example: 0 })
  private code: number
  @ApiProperty({ description: '返回的结果' })
  private data: T
  private error: any

  constructor(success: boolean, data: T, message: string) {
    this.code = success ? 0 : -1
    this.data = data
    this.success = success
    this.message = message
  }

  static ok<T = any>(data: T, message: string = '操作成功'): Result<T> {
    return new Result(true, data, message)
  }

  static fail(message: string = '失败'): Result {
    return new Result(false, null, message)
  }
}

@Injectable()
export class TransformDatabaseResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response: Response = context.switchToHttp().getResponse()
    response.status(HttpStatus.OK)
    return next.handle().pipe(
      map((data) => {
        // 这里可以对数据库返回的数据进行处理，例如过滤字段
        if (Array.isArray(data)) {
          return Result.ok(
            data.map((item) => this.transform(item)),
            '操作成功'
          )
        } else if (data.records && Array.isArray(data.records)) {
          return Result.ok({
            ...data,
            records: data.records.map((item) => this.transform(item))
          })
        }
        return Result.ok(this.transform(data), '操作成功')
      })
    )
  }

  private transform(data: any) {
    if (!data) return null
    delete data.password // 例如：删除密码字段
    if (typeof data === 'object') {
      const afterData = { ...data }
      for (const key of Object.keys(data)) {
        if (afterData[key] instanceof Date) {
          afterData[key] = dayjs(afterData[key]).format('YYYY-MM-DD HH:mm:ss')
        } else if (afterData[key] instanceof Array) {
          // 处理数组类型
          afterData[key] = afterData[key].map((item) => this.transform(item))
        }
      }
      return afterData
    }
    return data
  }
}
