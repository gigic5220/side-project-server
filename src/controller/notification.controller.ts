import {
    Body,
    Controller,
    Get,
    InternalServerErrorException, Param,
    Post, Put,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {Request} from "express";
import {AuthGuard} from "@nestjs/passport";
import {GroupJoinRequest} from "../entity/groupJoinRequest.entity";
import {NotificationService} from "../service/notification.service";
import {CreateNotificationDto} from "../dto/createNotification.dto";
import {NotificationCountDto} from "../dto/notificationCount.dto";
import {Notification} from "../entity/notification.entity";

@Controller('/notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly authService: AuthService,
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() createNotificationDto: CreateNotificationDto, @Req() request: Request): Promise<void>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            createNotificationDto.userId = user?.id
            await this.notificationService.create(createNotificationDto)
        } catch (error) {
            throw new InternalServerErrorException('서버오류입니다');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    async getMyList(@Req() request: Request, @Query('type') type: string): Promise<Notification[]>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            return await this.notificationService.getMyList(user?.id)
        } catch (error) {
            throw new InternalServerErrorException('서버오류입니다');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me/count')
    async getMyListCount(@Req() request: Request): Promise<NotificationCountDto>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            const notificationCountDto = new NotificationCountDto()
            notificationCountDto.count = await this.notificationService.getMyListCount(user?.id)
            return notificationCountDto;
        } catch (error) {
            throw new InternalServerErrorException('서버오류입니다');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: number): Promise<void> {
        await this.notificationService.update(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/read/:id')
    async read(@Param('id') id: number): Promise<void> {
        await this.notificationService.update(id);
    }
}
