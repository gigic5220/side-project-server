import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module";
import {Favor} from "../entity/favor.entity";
import {FavorUserAssociationModule} from "./favorUserAssociation.module";
import {FavorController} from "../controller/favor.controller";
import {FavorService} from "../service/favor.service";
import {FavorUserAssociationService} from "../service/favorUserAssociation.service";
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";
import {GroupUserAssociationService} from "../service/groupUserAssociation.service";
import {GroupService} from "../service/group.service";
import {NotificationService} from "../service/notification.service";
import {GroupModule} from "./group.module";
import {NotificationModule} from "./notification.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Favor, GroupUserAssociation]),
        forwardRef(() => AuthModule),
        FavorUserAssociationModule,
        GroupModule,
        NotificationModule
    ],
    controllers: [FavorController],
    providers: [FavorService, FavorUserAssociationService, GroupUserAssociationService, GroupService, NotificationService],
    exports: [FavorService, GroupUserAssociationService, GroupService, NotificationService, TypeOrmModule]
})
export class FavorModule {}