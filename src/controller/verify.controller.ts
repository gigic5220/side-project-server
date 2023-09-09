import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {VerifyDto} from "../dto/verify.dto";
import {VerifyService} from "../service/verify.service";
import {ResponseDto} from "../dto/response.dto";
import {VerificationInstance} from "twilio/lib/rest/verify/v2/service/verification";

type getVerifyNumberQuery = {
    phone: string;
}
@Controller('/verify')
export class VerifyController {
    constructor(private readonly verifyService: VerifyService) {}

    @Get('/number')
    async getVerifyNumber(@Query() query: getVerifyNumberQuery): Promise<ResponseDto<VerificationInstance>> {
        const verifyInfo = await this.verifyService.getVerifyNumber(query.phone)
        return new ResponseDto(verifyInfo, true, 200, 'success')
    }

    @Post('/check')
    checkVerifyNumber(@Body() dto: VerifyDto){
        return dto.number === '000000'
    }
}
