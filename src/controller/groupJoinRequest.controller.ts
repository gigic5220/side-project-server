import {
    Body,
    Controller, Delete,
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
import {GroupUserAssociationService} from "../service/groupUserAssociation.service";
import {CreateGroupUserAssociationDto} from "../dto/createGroupUserAssociation.dto";

@Controller('/groupJoinRequest')
export class GroupJoinRequestController {
    constructor(
        private readonly groupJoinRequestService: GroupJoinRequestService,
        private readonly groupUserAssociationService: GroupUserAssociationService,
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
                type: 'groupJoinRequest',
                parameterId: groupJoinRequest.id,
                parameterText: `${createGroupJoinRequestDto.nickName},${group?.name}`,
                parameterImage: createGroupJoinRequestDto.fileUrl,
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

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.groupJoinRequestService.softDelete(id)
    }

    @Post('/accept/:id')
    async accept(@Param('id') id: number, @Body() updateGroupJoinRequestDto: UpdateGroupJoinRequestDto): Promise<void> {
        await this.groupJoinRequestService.update(id, updateGroupJoinRequestDto)
        const groupJoinRequest = await this.groupJoinRequestService.get(id)
        const createGroupUserAssociationDto: CreateGroupUserAssociationDto = {
            userId: groupJoinRequest?.userId,
            groupId: groupJoinRequest?.groupId,
            nickName: groupJoinRequest?.nickName,
            fileUrl: groupJoinRequest?.fileUrl,
        }
        await this.groupUserAssociationService.create(createGroupUserAssociationDto)
    }
}
