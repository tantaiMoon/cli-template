import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { Response, Request } from 'express'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private dto: any,
    private excludeExtraneousValues?: boolean
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('>----🚀 serialize.interceptor 拦截器执行之前 -----> ')
    return next.handle().pipe(
      map((data: any) => {
        console.log('>----🚀 serialize.interceptor 拦截器执行之后 -----> ', this.dto)
        const result = plainToInstance(this.dto, data?.records ?? data, {
          // 默认为 false ，将所有属性全部暴露出去，设置 为 true ，所有经过该拦截器的接口都需要配置 Expose 或者 Exclude
          // Expose 暴露， Exclude 排除
          excludeExtraneousValues: this.excludeExtraneousValues,
          // 默认为 false， 设置为 true 时会对属性进行隐式的类型转换
          enableImplicitConversion: true
        })
        console.log('>-----------(serialize.interceptor.ts:25) var is result:', result)
        return data?.records ? { ...data, records: result } : result
      })
    )
  }
}
