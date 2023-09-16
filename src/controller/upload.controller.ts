import { Controller, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {ResponseDto} from "../dto/response.dto";
import {UploadFileResponseDto} from "../dto/uploadFileResponseDto";
import {UploadService} from "../service/upload.service";

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file): Promise<ResponseDto<UploadFileResponseDto>> {
        try {
            const url = await this.uploadService.upload(file);
            const uploadFileResponseDto = new UploadFileResponseDto(url);
            return new ResponseDto(uploadFileResponseDto, true, 200, 'success');
        } catch (error) {
            throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}