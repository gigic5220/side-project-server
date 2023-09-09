import * as twilio from 'twilio';
import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

@Injectable()
export class TwilioService {
    private client: twilio.Twilio;
    private accountSid: string;
    private authToken: string;
    private verifyServiceSid: string;
    constructor(private configService: ConfigService) {

        this.accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        this.authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        this.verifyServiceSid = this.configService.get('TWILIO_VERIFY_SERVICE_SID');

        console.log(this.verifyServiceSid)


        this.client = require('twilio')(accountSid, authToken);
        console.log('this.client', this.client)
    }

    sendVerificationCode(options: { to: string }) {
        return this.client.verify.v2
            .services(this.verifyServiceSid)
            .verifications.create({ to: options.to, channel: "sms" });
    }
    checkVerificationCode(options: { to: string; code: string }) {
        return this.client.verify.v2
            .services(this.verifyServiceSid)
            .verificationChecks.create({
                to: options.to,
                code: options.code,
            });
    }
}