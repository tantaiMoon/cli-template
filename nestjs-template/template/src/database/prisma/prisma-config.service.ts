import { DB_URL } from '@/config/db-url'
import type {
  PrismaOptionsFactory,
  PrismaOptionsInterface
} from '@/database/prisma/prisma-options.interface'
import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import type { Request } from 'express'

@Injectable()
export class PrismaConfigService implements PrismaOptionsFactory {
  constructor(@Inject(REQUEST) private request: Request) {}

  createPrismaModuleOptions(): Promise<PrismaOptionsInterface> | PrismaOptionsInterface {
    const { headers } = this.request
    const tenantId = (headers['x-tenant-id'] as string) ?? 'default'
    console.log(
      '>-----------(prisma-config.service.ts:16) var is tenantId:',
      tenantId,
      DB_URL[process.env.NODE_ENV ?? 'development'][tenantId]
    )
    return {
      url: DB_URL[process.env.NODE_ENV ?? 'development'][tenantId]
    }
  }
}
