import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenController } from '../controller/token.controller';
import {RefreshToken} from "../entity/refreshToken.entity";
import {TokenService} from "../service/token.service";
import {UserModule} from './user.module';
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([RefreshToken]),
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule)
    ],
    controllers: [TokenController],
    providers: [TokenService],
    exports: [TokenService, TypeOrmModule]
})
export class TokenModule {}