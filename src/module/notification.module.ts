import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module";
import {Notification} from "../entity/notification.entity";
import {NotificationController} from "../controller/notification.controller";
import {NotificationService} from "../service/notification.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification]),
        forwardRef(() => AuthModule),
    ],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService, TypeOrmModule]
})
export class NotificationModule {}