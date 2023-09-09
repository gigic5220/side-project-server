import { Injectable } from '@nestjs/common';
import { TwilioService } from "../service/twilio.service";
import phone from "phone";
import {VerificationInstance} from "twilio/lib/rest/verify/v2/service/verification";

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

        return this.twilioService.sendVerificationCode({to: phoneValidation.phoneNumber})
    }
}