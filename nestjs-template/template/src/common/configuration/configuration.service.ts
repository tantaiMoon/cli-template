import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  getKey<T = string>(key: string): T {
    return this.configService.get<T>(key, {
      infer: true
    }) as T
  }
}
