import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import {JwtStrategy} from "./jwt/jwt.strategy";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {PassportModule} from "@nestjs/passport";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {UserModule} from "../module/user.module";
import {TokenService} from "../service/token.service";
import {TokenModule} from "../module/token.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1y' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
      TokenModule
  ],
  providers: [TokenService, AuthService, JwtStrategy, JwtService],
  exports: [AuthService, JwtService, JwtModule],
})
export class AuthModule {}
