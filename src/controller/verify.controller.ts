import {Body, Controller, Post} from '@nestjs/common';
import {VerifyDto} from "../dto/verify.dto";
import {VerifyService} from "../service/verify.service";
import {VerificationInstance} from "twilio/lib/rest/verify/v2/service/verification";
import {VerificationCheckInstance} from "twilio/lib/rest/verify/v2/service/verificationCheck";

@Controller('/verify')
export class VerifyController {
    constructor(private readonly verifyService: VerifyService) {}

    @Post('/number')
    async getVerifyNumber(@Body() dto: VerifyDto): Promise<VerificationInstance> {
        return await this.verifyService.getVerifyNumber(dto.phone)
    }

    @Post('/check')
    async checkVerifyNumber(@Body() dto: VerifyDto):Promise<VerificationCheckInstance>{
        return await this.verifyService.checkVerifyNumber(dto.phone, dto.code)
    }
}
