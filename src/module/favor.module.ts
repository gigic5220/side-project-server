import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module";
import {Favor} from "../entity/favor.entity";
import {FavorUserAssociationModule} from "./favorUserAssociation.module";
import {FavorController} from "../controller/favor.controller";
import {FavorService} from "../service/favor.service";
import {FavorUserAssociationService} from "../service/favorUserAssociation.service";
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Favor, GroupUserAssociation]),
        forwardRef(() => AuthModule),
        FavorUserAssociationModule
    ],
    controllers: [FavorController],
    providers: [FavorService, FavorUserAssociationService],
    exports: [FavorService, TypeOrmModule]
})
export class FavorModule {}