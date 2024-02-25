import { Injectable } from '@nestjs/common';
import { TwilioService } from "../service/twilio.service";
import phone from "phone";
import {VerificationInstance} from "twilio/lib/rest/verify/v2/service/verification";
import {VerificationCheckInstance} from "twilio/lib/rest/verify/v2/service/verificationCheck";

@Injectable()
export class VerifyService {
    constructor(
        private twilioService: TwilioService
    ) {}

    getVerifyNumber(phoneNumber: string): Promise<VerificationInstance> {
        const phoneValidation = phone(phoneNumber, { country: "KOR" });
        if (!phoneValidation.isValid) {
            throw new Error("invalid format of the phone.");
        }
        // todo: test 전용 휴대폰 번호 제거 필요
        return this.twilioService.sendVerificationCode({to: '+821030592130'})
        //return this.twilioService.sendVerificationCode({to: phoneValidation.phoneNumber})
    }

    checkVerifyNumber(phoneNumber: string, code: string):  Promise<VerificationCheckInstance> {
        const phoneValidation = phone(phoneNumber, { country: "KOR" });
        if (!phoneValidation.isValid) {
            throw new Error("invalid format of the phone.");
        }
        // todo: test 전용 휴대폰 번호 제거 필요
        return this.twilioService.checkVerificationCode({to: '+821030592130', code: code})
        //return this.twilioService.checkVerificationCode({to: phoneValidation.phoneNumber, code: code})
    }
}