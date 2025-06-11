import type { ModuleMetadata, Type } from '@nestjs/common'
import { Prisma } from '@prisma/client'

export interface PrismaOptionsInterface {
  url?: string
  options?: Prisma.PrismaClientOptions
  name?: string
  retryAttempts?: number
  retryDelay?: number
  connectionFactory?: (connection: any, client: any) => any
  connectionErrorFactory?: (
    error: Prisma.PrismaClientKnownRequestError
  ) => Prisma.PrismaClientKnownRequestError
}

export interface PrismaOptionsFactory {
  createPrismaModuleOptions(): Promise<PrismaOptionsInterface> | PrismaOptionsInterface
}
export type PrismaModuleFactoryOptions = Omit<PrismaOptionsInterface, 'name'>

export interface PrismaModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<PrismaModuleFactoryOptions> | PrismaModuleFactoryOptions
  inject?: any[]
  useClass?: Type<PrismaOptionsFactory>
  useExisting?: Type<PrismaOptionsFactory>
  name?: string
}
