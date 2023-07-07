import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule} from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./entity/user.entity";
import {UsersModule} from "./module/users.module";

@Module({
  imports: [
      ConfigModule.forRoot({
          cache: true,
          isGlobal: true
      }),
      TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'rootroot',
          database: 'side-project',
          entities: [User],
          synchronize: true,
      }),
      UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
