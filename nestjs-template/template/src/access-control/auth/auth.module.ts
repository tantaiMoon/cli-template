import { ConfigurationService } from '@/common/configuration/configuration.service'
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from '@/user/user.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigEnum } from '@/common/enums/config.enum'
import { JwtStrategy } from './strategy/auth.strategy'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigurationService],
      useFactory: async (configService: ConfigurationService) => {
        return {
          secret: configService.getKey(ConfigEnum.JWT_SECRET),
          signOptions: {
            expiresIn: configService.getKey(ConfigEnum.JWT_EXPIRES)
          }
        }
      }
    }),
    UserModule,
    HttpModule
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  exports: [AuthService]
})
export class AuthModule {}
