import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {File} from "../entity/file.entity";
import {User} from "../entity/user.entity";
import {FileController} from "../controller/file.controller";
import {FileService} from "../service/file.service";
import {AuthService} from "../auth/auth.service";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {UserService} from "../service/user.service";
import {TokenModule} from "./token.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([File]),
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET_KEY'),
                signOptions: { expiresIn: '1y' },
            }),
            inject: [ConfigService],
        }),
        TokenModule
    ],
    controllers: [FileController],
    providers: [FileService, AuthService, UserService]
})
export class FileModule {}
