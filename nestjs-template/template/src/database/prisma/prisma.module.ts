import { type DynamicModule, Module } from '@nestjs/common'
import { PrismaCoreModule } from './prisma-core.module'
import type { PrismaModuleAsyncOptions, PrismaOptionsInterface } from './prisma-options.interface'

@Module({})
export class PrismaModule {
  static forRoot(options: PrismaOptionsInterface): DynamicModule
  static forRoot(url: string): DynamicModule
  static forRoot(url: string, name: string): DynamicModule
  static forRoot(arg: any, ...args) {
    let _options: PrismaOptionsInterface
    if (args?.length) {
      _options = {
        name: args[0],
        url: arg as string
      }
    } else if (typeof arg === 'string') {
      _options = {
        url: arg
      }
    } else {
      _options = arg
    }
    return {
      module: PrismaModule,
      imports: [PrismaCoreModule.forRoot(_options)]
    }
  }

  static forRootAsync(options: PrismaModuleAsyncOptions) {
    return {
      module: PrismaModule,
      imports: [PrismaCoreModule.forRootAsync(options)]
    }
  }
}
