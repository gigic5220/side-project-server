import {Body, Controller, Get, Param, Post, Query, Req} from '@nestjs/common';
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
    ): Promise<File> {
        const user = await this.authService.getUserFromAccessToken(request)
        return await this.fileService.findOne(user?.id, type)
    }

    @Post()
    async create(
        @Body() dto: CreateFileDto,
        @Req() request: Request
    ): Promise<void>{
        const user =  await this.authService.getUserFromAccessToken(request)
        dto.userId = user.id
        return await this.fileService.create(dto)
    }

}