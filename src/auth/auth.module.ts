import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import {JwtStrategy} from "./jwt/jwt.strategy";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {UsersModule} from "../module/users.module";

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
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
