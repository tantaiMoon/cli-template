import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis'
import { Global, Module } from '@nestjs/common'
import { ConfigurationService } from '@/common/configuration/configuration.service'
import { ConfigEnum } from '@/common/enums/config.enum'

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => {
        const type = configurationService.getKey('REDIS_TYPE') ?? 'single'
        if (type === 'single') {
          const host = configurationService.getKey(ConfigEnum.REDIS_HOST)
          const port = configurationService.getKey<number>(ConfigEnum.REDIS_PORT)
          const passwd = configurationService.getKey(ConfigEnum.REDIS_PASSWORD)
          return {
            type: 'single',
            url: `redis://${host}:${port}`,
            options: {
              password: passwd
            }
          } as RedisModuleOptions
        } else {
          //  集群模式
          const hosts = (
            configurationService.getKey(ConfigEnum.REDIS_CLUSTER_HOST) ?? '127.0.0.1'
          ).split(',')
          const ports = (configurationService.getKey(ConfigEnum.REDIS_CLUSTER_PORT) ?? '6379')
            .split(',')
            .map((port) => parseInt(port, 10))
          const nodes = hosts.map((host, index) => ({
            host,
            port: ports[index]
          }))
          return {
            type: 'cluster',
            nodes,
            options: {
              password: configurationService.getKey(ConfigEnum.REDIS_PASSWORD)
            }
          } as RedisModuleOptions
        }
      }
    })
  ],
  exports: [RedisModule]
})
export class RedisCommonModule {}
