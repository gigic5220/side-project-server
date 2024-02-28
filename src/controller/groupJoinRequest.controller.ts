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
import {GroupJoinRequestService} from "../service/groupJoinRequest.service";
import {CreateGroupJoinRequestDto} from "../dto/createGroupJoinRequest.dto";
import {GroupJoinRequest} from "../entity/groupJoinRequest.entity";
import {UpdateGroupJoinRequestDto} from "../dto/updateGroupJoinRequest.dto";
import {NotificationService} from "../service/notification.service";
import {CreateNotificationDto} from "../dto/createNotification.dto";
import {GroupService} from "../service/group.service";
import {NotificationCountDto} from "../dto/notificationCount.dto";

@Controller('/groupJoinRequest')
export class GroupJoinRequestController {
    constructor(
        private readonly groupJoinRequestService: GroupJoinRequestService,
        private readonly notificationService: NotificationService,
        private readonly groupService: GroupService,
        private readonly authService: AuthService,
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() createGroupJoinRequestDto: CreateGroupJoinRequestDto, @Req() request: Request): Promise<void>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            createGroupJoinRequestDto.userId = user?.id
            const groupJoinRequest = await this.groupJoinRequestService.create(createGroupJoinRequestDto)
            const group = await this.groupService.findOne(createGroupJoinRequestDto.groupId)
            const createNotificationDto: CreateNotificationDto = {
                userId: group.userId,
                //message: `'${group?.name}' 그룹에 '${createGroupJoinRequestDto.nickName}' 님께서 가입을 요청했어요. 요청을 수락할까요?`,
                message: `'{param}' 그룹에 '{param}' 님께서 가입을 요청했어요. 요청을 수락할까요?`,
                type: 'groupJoinRequest',
                parameterId: groupJoinRequest.id,
                parameterText: `${group?.name},${createGroupJoinRequestDto.nickName}`
            }
            await this.notificationService.create(createNotificationDto)
        } catch (error) {
            throw new InternalServerErrorException('서버오류입니다');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    async getMyList(@Req() request: Request): Promise<GroupJoinRequest[]>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            return await this.groupJoinRequestService.getMyList(user?.id)
        } catch (error) {
            throw new InternalServerErrorException('서버오류입니다');
        }
    }



    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateGroupJoinRequestDto: UpdateGroupJoinRequestDto): Promise<void> {
        await this.groupJoinRequestService.update(id, updateGroupJoinRequestDto);
    }
}
