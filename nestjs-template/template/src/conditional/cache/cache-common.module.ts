import { Global, Module } from '@nestjs/common'
import { createKeyv, Keyv } from '@keyv/redis'
import { CacheModule } from '@nestjs/cache-manager'
import { CacheableMemory } from 'cacheable'
import { ConfigurationService } from '@/common/configuration/configuration.service'
import { ConfigEnum } from '@/common/enums/config.enum'

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => {
        const cacheType = configurationService.getKey(ConfigEnum.CACHE_TYPE)
        if (cacheType === 'redis') {
          const host = configurationService.getKey(ConfigEnum.REDIS_HOST) ?? '127.0.0.1'
          const port = configurationService.getKey<number>(ConfigEnum.REDIS_PORT) ?? 6379
          const passwd = configurationService.getKey(ConfigEnum.REDIS_PASSWORD)
          return {
            stores: [
              createKeyv({
                url: `redis://${host}:${port}`,
                password: passwd
              })
            ]
          }
        } else {
          return {
            stores: [
              new Keyv({
                store: new CacheableMemory({
                  ttl: configurationService.getKey<number>(ConfigEnum.CACHE_TTL) ?? 30 * 1000,
                  lruSize: configurationService.getKey<number>(ConfigEnum.CACHE_MAX_ITEMS) ?? 100
                })
              })
            ]
          }
        }
      }
    })
  ],
  exports: [CacheModule]
})
export class CacheCommonModule {}
