import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./entity/user.entity";
import {UsersModule} from "./module/users.module";
import { ConfigModule, ConfigService } from '@nestjs/config';
import {VerifyModule} from "./module/verify.module";
import { AuthModule } from './auth/auth.module';

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
              entities: [User],
              synchronize: true,
          }),
          inject: [ConfigService],
      }),
      UsersModule,
      VerifyModule,
      AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

