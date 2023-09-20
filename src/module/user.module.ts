import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../service/user.service';
import { UserController } from '../controller/user.controller';
import { User } from '../entity/user.entity';
import { File } from '../entity/file.entity';
import {AuthModule} from "../auth/auth.module";
import {FileService} from "../service/file.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([File]),
        forwardRef(() => AuthModule),
    ],
    controllers: [UserController],
    providers: [UserService, FileService],
    exports: [UserService, TypeOrmModule]
})
export class UserModule {}