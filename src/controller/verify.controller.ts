import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {VerifyDto} from "../dto/verify.dto";
import {VerifyService} from "../service/verify.service";
import {ResponseDto} from "../dto/response.dto";
import {VerificationInstance} from "twilio/lib/rest/verify/v2/service/verification";
import {VerificationCheckInstance} from "twilio/lib/rest/verify/v2/service/verificationCheck";

type getVerifyNumberQuery = {
    phone: string;
}
@Controller('/verify')
export class VerifyController {
    constructor(private readonly verifyService: VerifyService) {}

    @Post('/number')
    async getVerifyNumber(@Body() dto: VerifyDto): Promise<ResponseDto<VerificationInstance>> {
        const verifyInfo = await this.verifyService.getVerifyNumber(dto.phone)
        return new ResponseDto(verifyInfo, true, 200, 'success')
    }

    @Post('/check')
    async checkVerifyNumber(@Body() dto: VerifyDto):Promise<ResponseDto<VerificationCheckInstance>>{
        const verifyInfo = await this.verifyService.checkVerifyNumber(dto.phone, dto.code)
        return new ResponseDto(verifyInfo, true, 200, 'success')
    }
}
