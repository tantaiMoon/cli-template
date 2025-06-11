import { Global, Module } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import { LoggerService } from './logger.service'
import { ConfigurationService } from '@/common/configuration/configuration.service'
import { ConfigEnum } from '@/common/enums/config.enum'
import { consoleTransport, createDailyRotateTransport } from './create-rotate-transport'

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (config: ConfigurationService) => {
        const LOG_ON = config.getKey<boolean>(ConfigEnum.LOG_ON)
        return {
          transports: [
            consoleTransport,
            ...(LOG_ON
              ? [
                  createDailyRotateTransport('info', 'application'),
                  createDailyRotateTransport('error', 'error')
                ]
              : [])
          ]
        }
      }
    })
  ],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}
