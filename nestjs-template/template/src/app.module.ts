import { AccessControlModule } from '@/access-control/access-control.module'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigurationModule } from '@/common/configuration/configuration.module'
import { UserModule } from './user/user.module'
import { DatabaseModule } from '@/database/database.module'
import { LoggerModule } from '@/common/logger/logger.module'
import { ConditionalModule } from './conditional/conditional.module'

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    LoggerModule,
    UserModule,
    ConditionalModule.register(),
    AccessControlModule
  ],
  // TODO 与 AppController 中的注释对应，
  //  获取 DI 系统中具体 class 类的实例，以及他们之间的依赖关系
  controllers: [AppController],
  // [控制反转] 告诉 nestjs 将 providers 中的 类实例化到 DI 系统中，
  /* TODO 依赖查找：
       1. 如果在 providers 中不提供，那么就在 imports 中查找
       imports 就会查找其他的 module ， 其他模块中需要 providers 中提供并且在 exports 中暴露
       2. 直接在 providers 中提供
   */
  providers: [],
  // 告诉 nestjs exports 中的类我需要在其他的地方使用
  exports: []
})
export class AppModule {}
