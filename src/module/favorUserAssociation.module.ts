import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module";
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";
import {GroupUserAssociationController} from "../controller/groupUserAssociation.controller";
import {GroupUserAssociationService} from "../service/groupUserAssociation.service";
import {FavorUserAssociation} from "../entity/favorUserAssociation.entity";
import {FavorUserAssociationController} from "../controller/favorUserAssociation.controller";
import {FavorUserAssociationService} from "../service/favorUserAssociation.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([FavorUserAssociation]),
        forwardRef(() => AuthModule),
    ],
    controllers: [FavorUserAssociationController],
    providers: [FavorUserAssociationService],
    exports: [FavorUserAssociationService, TypeOrmModule]
})
export class FavorUserAssociationModule {}