import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { type INestApplication, VERSION_NEUTRAL, VersioningType } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { useContainer } from 'class-validator'
import cookieParser from 'cookie-parser'
import { I18nService, I18nValidationPipe } from 'nestjs-i18n'
import { AppModule } from './app.module'
import { TransformDatabaseResponseInterceptor } from '@/common/interceptors/transform.interceptor'
import { AllExceptionFilter } from '@/common/filters/all-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn', 'log', 'debug', 'verbose'] // 日志级别
  })
  const config = app.get(ConfigService)
  const httpAdapterHost = app.get(HttpAdapterHost)
  const i18n = app.get<I18nService>(I18nService)
  const PORT = config.get<number>('APP_PORT') ?? 3000
  let version: string | string[] = config.get<string>('APP_VERSION', '1')
  if (version!.includes(',')) {
    version = version!.split(',')
  }
  const prefix = config.get<string>('APP_PREFIX')
  const cors = config.get<boolean>('APP_CORS')
  if (version) {
    // 启用版本控制
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: version ?? VERSION_NEUTRAL
    })
  }
  if (prefix) {
    // 设置全局前缀
    app.setGlobalPrefix(prefix)
  }
  // ⚠️： 启用全局异常过滤器，捕获所有异常，全局异常过滤器只能有一个
  app.useGlobalFilters(new AllExceptionFilter(httpAdapterHost, i18n))
  // 全局日志模块替换为 winston
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  // 启用跨域
  if (cors) {
    app.enableCors()
  }
  app.useGlobalPipes(
    // ValidationPipe
    new I18nValidationPipe({
      transform: true, // 开启自动转换
      whitelist: true, // 开启白名单, 只允许白名单中的字段,false -> 表示不会删除 白名单之外的字段
      transformOptions: {
        enableImplicitConversion: true, // 开启隐式转换
        enableCircularCheck: true // 开启循环检查
      }
    })
  )
  // 全局注入 Repository，可以让自定义校验器支持依赖注入
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  // 全局拦截器
  app.useGlobalInterceptors(new TransformDatabaseResponseInterceptor())

  app.use(cookieParser())
  // 启用 swagger
  enableSwagger(app)
  await app.listen(PORT)
  console.log('🌰🌰🌰~~~~~~ server is running on port -----> :', PORT)
}
bootstrap()

function enableSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Moyi-be Swagger')
    .setDescription('Moyi-be API description')
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, documentFactory)
}
