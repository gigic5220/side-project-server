import {Body, Controller, Get, Param, Post, Query, Req} from '@nestjs/common';
import {ResponseDto} from "../dto/response.dto";
import {FileService} from "../service/file.service";
import {CreateFileDto} from "../dto/createFile.dto";
import {AuthService} from "../auth/auth.service";
import { File } from '../entity/file.entity';
import { Request } from 'express';

@Controller('/file')
export class FileController {
    constructor(
        private readonly fileService: FileService,
        private readonly authService: AuthService
    ) {}

    @Get()
    async findOne(
        @Query('type') type: string,
        @Req() request: Request
    ): Promise<ResponseDto<File>> {
        const user = await this.authService.getUserFromAccessToken(request)
        return new ResponseDto(await this.fileService.findOne(user?.id, type), true, 200, 'success')
    }

    @Post()
    async create(
        @Body() dto: CreateFileDto,
        @Req() request: Request
    ): Promise<ResponseDto<void>>{
        const user =  await this.authService.getUserFromAccessToken(request)
        dto.userId = user.id
        return new ResponseDto(await this.fileService.create(dto), true, 200, 'success');
    }

}