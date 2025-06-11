import { PrismaConfigService } from 'src/database/prisma/prisma-config.service'
import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    PrismaModule.forRootAsync({
      useClass: PrismaConfigService
    })
  ]
})
export class DatabaseModule {}
