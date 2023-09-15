import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../service/user.service';
import { UserController } from '../controller/user.controller';
import { User } from '../entity/user.entity';
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, TypeOrmModule]
})
export class UserModule {}