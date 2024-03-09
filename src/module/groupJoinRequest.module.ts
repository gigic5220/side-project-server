import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module";
import {GroupJoinRequest} from "../entity/groupJoinRequest.entity";
import {GroupJoinRequestController} from "../controller/groupJoinRequest.controller";
import {GroupJoinRequestService} from "../service/groupJoinRequest.service";
import {NotificationService} from "../service/notification.service";
import {GroupService} from "../service/group.service";
import {NotificationModule} from "./notification.module";
import {GroupModule} from "./group.module";
import {GroupUserAssociationModule} from "./groupUserAssociation.module";
import {GroupUserAssociationService} from "../service/groupUserAssociation.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([GroupJoinRequest]),
        forwardRef(() => AuthModule),
        NotificationModule,
        GroupModule,
        GroupUserAssociationModule
    ],
    controllers: [GroupJoinRequestController],
    providers: [GroupJoinRequestService, NotificationService, GroupService, GroupUserAssociationService],
    exports: [GroupJoinRequestService, NotificationService, GroupService,GroupUserAssociationService, TypeOrmModule]
})


export class GroupJoinRequestModule {}