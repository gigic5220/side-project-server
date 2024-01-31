import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Group} from "../entity/group.entity";
import {GroupService} from "../service/group.service";
import {GroupController} from "../controller/group.controller";
import {AuthModule} from "../auth/auth.module";
import {GroupUserAssociationService} from "../service/groupUserAssociation.service";
import {GroupUserAssociationModule} from "./groupUserAssociation.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Group]),
        forwardRef(() => AuthModule),
        GroupUserAssociationModule
    ],
    controllers: [GroupController],
    providers: [GroupService, GroupUserAssociationService],
    exports: [GroupService, TypeOrmModule]
})
export class GroupModule {}