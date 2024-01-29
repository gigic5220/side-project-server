import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Group} from "../entity/group.entity";
import {GroupService} from "../service/group.service";
import {GroupController} from "../controller/group.controller";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Group]),
        forwardRef(() => AuthModule),
    ],
    controllers: [GroupController],
    providers: [GroupService],
    exports: [GroupService, TypeOrmModule]
})
export class GroupModule {}