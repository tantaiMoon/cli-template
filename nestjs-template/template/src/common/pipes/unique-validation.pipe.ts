import { getUniqueFields } from '@/common/decorators/validator-field-unique.decorator'
import { DB_URL } from '@/config/db-url'
import { PRISMA_CONNECTIONS } from '@/database/prisma/prisma.constants'
import {
  type ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  type PipeTransform
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { PrismaClient } from '@prisma/client'
import type { Request } from 'express'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class FieldUniqueValidationPipe implements PipeTransform {
  private readonly logger = new Logger('FieldUniqueValidationPipe')

  constructor(
    @Inject(REQUEST) private request: Request,
    @Inject(PRISMA_CONNECTIONS) private readonly connections: Record<string, PrismaClient>,
    @Inject(I18nService) private readonly i18n: I18nService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: object, _metadata: ArgumentMetadata) {
    this.logger.log('validation value: ', JSON.stringify(value))
    const tenantId = (this.request.headers['x-tenant-id'] as string) || 'default'
    const datasourceUrl = DB_URL[process.env.NODE_ENV ?? 'development'][tenantId]
    const prismaClient: PrismaClient = this.connections[datasourceUrl]
    const uniqueFields = getUniqueFields(value)
    console.log('>-----------(unique-validation.pipe.ts:34) var is uniqueFields:', uniqueFields)
    for (const { field, schema } of uniqueFields) {
      const result = await prismaClient[schema].findUnique({
        where: {
          [field]: value[field]
        }
      })
      if (result) {
        throw new BadRequestException(
          this.i18n.t('validation.IS_EXISTS', {
            args: {
              property: `${field} [${result[field]}]`
            }
          })
        )
      }
    }
    return value
  }
}
