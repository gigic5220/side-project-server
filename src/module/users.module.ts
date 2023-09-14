import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users.controller';
import { User } from '../entity/user.entity';
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule),
    ],
    controllers: [UsersController],
    providers: [UsersService],  // Repository<User> 제거
    exports: [UsersService, TypeOrmModule]  // TypeOrmModule 추가
})
export class UsersModule {}