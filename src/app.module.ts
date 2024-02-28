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
import {GroupUserAssociation} from "./entity/groupUserAssociation.entity";
import {GroupUserAssociationModule} from "./module/groupUserAssociation.module";
import {FavorUserAssociation} from "./entity/favorUserAssociation.entity";
import {Favor} from "./entity/favor.entity";
import {FavorUserAssociationModule} from "./module/favorUserAssociation.module";
import {FavorModule} from "./module/favor.module";
import {GroupJoinRequest} from "./entity/groupJoinRequest.entity";
import {GroupJoinRequestModule} from "./module/groupJoinRequest.module";
import {Notification} from "./entity/notification.entity";
import {NotificationModule} from "./module/notification.module";

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
              entities: [
                  User,
                  RefreshToken,
                  File,
                  Group,
                  GroupUserAssociation,
                  Favor,
                  FavorUserAssociation,
                  GroupJoinRequest,
                  Notification
              ],
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
      GroupUserAssociationModule,
      FavorModule,
      FavorUserAssociationModule,
      GroupJoinRequestModule,
      NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

