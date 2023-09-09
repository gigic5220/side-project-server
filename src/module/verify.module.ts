import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import {VerifyService} from "../service/verify.service";
import {VerifyController} from "../controller/verify.controller";
import {TwilioService} from "../service/twilio.service";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [VerifyService, TwilioService],
    controllers: [VerifyController],
})
export class VerifyModule {}