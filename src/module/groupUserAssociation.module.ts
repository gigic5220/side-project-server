import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module";
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";
import {GroupUserAssociationController} from "../controller/groupUserAssociation.controller";
import {GroupUserAssociationService} from "../service/groupUserAssociation.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([GroupUserAssociation]),
        forwardRef(() => AuthModule),
    ],
    controllers: [GroupUserAssociationController],
    providers: [GroupUserAssociationService],
    exports: [GroupUserAssociationService, TypeOrmModule]
})
export class GroupUserAssociationModule {}