import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigEnum } from '@/common/enums/config.enum'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(ConfigEnum.JWT_SECRET)!
    })
  }

  async validate(payload: Record<string, any>): Promise<{ id: number; username: string }> {
    return {
      id: payload.sub,
      username: payload.username
    }
  }
}
