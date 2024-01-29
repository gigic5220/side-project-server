import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./entity/user.entity";
import {File} from "./entity/file.entity";
import {UserModule} from "./module/user.module";
import { ConfigModule, ConfigService } from '@nestjs/config';
import {VerifyModule} from "./module/verify.module";
import { AuthModule } from './auth/auth.module';
import {RefreshToken} from "./entity/refreshToken.entity";
import {TokenModule} from "./module/token.module";
import { UploadModule } from './module/upload.module';
import { FileModule } from './module/file.module';
import {GroupModule} from "./module/group.module";
import {Group} from "./entity/group.entity";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
      }),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
              type: 'mysql',
              host: configService.get('DATABASE_HOST'),
              port: +configService.get<number>('DATABASE_PORT'),
              username: configService.get('DATABASE_USERNAME'),
              password: configService.get('DATABASE_PASSWORD'),
              database: configService.get('DATABASE_NAME'),
              entities: [User, RefreshToken, File, Group],
              synchronize: true,
              logging: true,
          }),
          inject: [ConfigService],
      }),
      UserModule,
      VerifyModule,
      AuthModule,
      TokenModule,
      UploadModule,
      FileModule,
      GroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

