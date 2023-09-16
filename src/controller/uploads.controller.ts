import { Controller, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {ResponseDto} from "../dto/response.dto";
import {UploadFileResponseDto} from "../dto/uploadFileResponseDto";
import {UploadsService} from "../service/upload.service";

@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) {}

    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file): Promise<ResponseDto<UploadFileResponseDto>> {
        try {
            const url = await this.uploadsService.upload(file);
            const uploadFileResponseDto = new UploadFileResponseDto(url);
            return new ResponseDto(uploadFileResponseDto, true, 200, 'success');
        } catch (error) {
            throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}