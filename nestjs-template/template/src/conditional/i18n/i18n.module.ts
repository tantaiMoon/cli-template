import { ConfigurationService } from '@/common/configuration/configuration.service'
import { ConfigEnum } from '@/common/enums/config.enum'
import { Global, Module } from '@nestjs/common'
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import { join } from 'path'

@Global()
@Module({
  imports: [
    I18nModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configService: ConfigurationService) => {
        return {
          fallbackLanguage: configService.getKey(ConfigEnum.APP_LANGUAGE),
          loaderOptions: {
            path: join(__dirname, '../../i18n/'),
            watch: true
          }
        }
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang'])
      ]
    })
  ],
  exports: []
})
export class I18nCommonModule {}
