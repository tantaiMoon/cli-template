import { UseInterceptors } from '@nestjs/common'
import { SerializeInterceptor } from '@/common/interceptors/serialize.interceptor'

interface ClassConstructor {
  new (...args: any[]): any
}

/**
 * description:
 * @returns {MethodDecorator | ClassDecorator}
 * @param dto 响应的数据
 * @param exposeAll 拦截器序列化后的数据是否暴露所有的属性，默认为 false， 全部暴露「@Exclude() 修饰的属性排除」，设置为true 时只有 @Expose() 装饰的字段会被暴露
 */
export const Serialize = (dto: ClassConstructor, exposeAll = false) => {
  return UseInterceptors(new SerializeInterceptor(dto, exposeAll))
}
