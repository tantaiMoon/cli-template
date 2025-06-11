import {
  type DynamicModule,
  Global,
  Module,
  type OnApplicationShutdown,
  type Provider,
  Type
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaClient as PrismaPgClient } from 'prisma-postgresql'
import { PrismaClient as PrismaMysqlClient } from 'prisma-mysql'
import { catchError, defer, lastValueFrom } from 'rxjs'
import type {
  PrismaModuleAsyncOptions,
  PrismaOptionsFactory,
  PrismaOptionsInterface
} from './prisma-options.interface'
import { getDbType, handleRetry } from './prisma.utils'
import {
  PRISMA_CONNECTION_NAME,
  PRISMA_CONNECTIONS,
  PRISMA_MODULE_OPTIONS
} from './prisma.constants'

@Global()
@Module({})
export class PrismaCoreModule implements OnApplicationShutdown {
  private static connections: Record<string, PrismaClient> = {}
  onApplicationShutdown() {
    if (PrismaCoreModule.connections && Object.keys(PrismaCoreModule.connections).length > 0) {
      for (const key of Object.keys(PrismaCoreModule.connections)) {
        const connect = PrismaCoreModule.connections[key]
        if (connect && typeof connect.$disconnect === 'function') {
          connect.$disconnect()
        }
      }
    }
  }

  static forRoot(opts: PrismaOptionsInterface): DynamicModule {
    const {
      name,
      options = {},
      url,
      connectionErrorFactory,
      connectionFactory,
      retryDelay = 3000,
      retryAttempts = 10
    } = opts
    const connectionError = connectionErrorFactory ?? ((err) => err)
    const providerName = name || PRISMA_CONNECTION_NAME
    const dbType = getDbType(url!)
    let Client: any
    const _opts = {
      datasourceUrl: url,
      ...options
    }
    if (dbType === 'mysql') {
      Client = PrismaMysqlClient
    } else if (dbType === 'postgresql' || dbType === 'postgres') {
      Client = PrismaPgClient
    } else {
      throw new Error(`Unsupported database type: ${dbType}`)
    }
    const prismaConnectionFactory =
      connectionFactory ?? (async (conn: any) => await new Client(conn))
    const prismaClientProvider: Provider = {
      provide: providerName,
      useFactory: async () => {
        const url = _opts.datasourceUrl!
        if (this.connections[url]) {
          return this.connections[url]
        }
        // 错误重试
        const client = await prismaConnectionFactory(_opts, Client)
        this.connections[url] = client
        return lastValueFrom(
          defer(async () => await client.$connect()).pipe(
            handleRetry(retryAttempts, retryDelay),
            catchError((err) => {
              throw connectionError(err)
            })
          )
        ).then(() => client)
      }
    }
    const connectionsProvider: Provider = {
      provide: PRISMA_CONNECTIONS,
      useValue: this.connections
    }
    return {
      module: PrismaCoreModule,
      providers: [prismaClientProvider, connectionsProvider],
      exports: [prismaClientProvider, connectionsProvider],
      imports: []
    }
  }

  static forRootAsync(options: PrismaModuleAsyncOptions) {
    const providerName = options.name || PRISMA_CONNECTION_NAME
    const prismaClientProvider: Provider = {
      provide: providerName,
      inject: [PRISMA_MODULE_OPTIONS],
      useFactory: async (prismaModuleOptions: PrismaOptionsInterface) => {
        const {
          options = {},
          url,
          connectionErrorFactory,
          connectionFactory,
          retryDelay = 3000,
          retryAttempts = 10
        } = prismaModuleOptions
        if (!url) {
          throw new Error('数据库连接地址不能为空，请检查 租户ID是否正确')
        }
        const dbType = getDbType(url!)
        let Client
        const _opts = {
          datasourceUrl: url,
          ...options
        }
        if (dbType === 'mysql') {
          Client = PrismaMysqlClient
        } else if (dbType === 'postgresql' || dbType === 'postgres') {
          Client = PrismaPgClient
        } else {
          throw new Error(`Unsupported database type: ${dbType}`)
        }
        const connectionError = connectionErrorFactory ?? ((err) => err)
        const prismaConnectionFactory =
          connectionFactory ?? (async (conn: any) => await new Client(conn))
        return lastValueFrom(
          defer(async () => {
            const url = _opts.datasourceUrl!
            if (this.connections[url]) {
              return this.connections[url]
            }
            const client = await prismaConnectionFactory(_opts, Client)
            this.connections[url] = client
            return client
          }).pipe(
            handleRetry(retryAttempts, retryDelay),
            catchError((err) => {
              throw connectionError(err)
            })
          )
        )
      }
    }
    const asyncProviders = this.createAsyncProviders(options)
    const connectionsProvider: Provider = {
      provide: PRISMA_CONNECTIONS,
      useValue: this.connections
    }
    return {
      module: PrismaCoreModule,
      exports: [prismaClientProvider, connectionsProvider],
      providers: [...asyncProviders, prismaClientProvider, connectionsProvider]
    }
  }

  private static createAsyncProviders(options: PrismaModuleAsyncOptions) {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }
    const useClass = options.useClass!
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass
      }
    ]
  }

  // 创建 PRISMA_MODULE_OPTIONS 的 provider 来源
  private static createAsyncOptionsProvider(options: PrismaModuleAsyncOptions) {
    if (options.useFactory) {
      return {
        provide: PRISMA_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || []
      }
    }
    const inject = [(options.useClass || options.useExisting) as Type<PrismaOptionsFactory>]
    return {
      provide: PRISMA_MODULE_OPTIONS,
      useFactory: async (optionsFactory: PrismaOptionsFactory) =>
        await optionsFactory.createPrismaModuleOptions(),
      inject
    }
  }
}
