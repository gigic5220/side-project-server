import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Put, Query,
    Req,
    UseGuards
} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {Request} from "express";
import {GroupService} from "../service/group.service";
import {GroupUserAssociationService} from "../service/groupUserAssociation.service";
import {AuthGuard} from "@nestjs/passport";
import {FavorService} from "../service/favor.service";
import {FavorUserAssociationService} from "../service/favorUserAssociation.service";
import {CreateFavorDto} from "../dto/createFavor.dto";
import {CreateFavorUserAssociationDto} from "../dto/createFavorUserAssociation.dto";
import {UpdateFavorDto} from "../dto/updateFavor.dto";
import {Favor} from "../entity/favor.entity";
import {CreateNotificationDto} from "../dto/createNotification.dto";
import {NotificationService} from "../service/notification.service";

@Controller('/favor')
export class FavorController {
    constructor(
        private readonly favorService: FavorService,
        private readonly favorUserAssociationService: FavorUserAssociationService,
        private readonly groupUserAssociationService: GroupUserAssociationService,
        private readonly groupService: GroupService,
        private readonly notificationService: NotificationService,
        private readonly authService: AuthService,
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() createFavorDto: CreateFavorDto, @Req() request: Request): Promise<void>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            createFavorDto.creatorId = user?.id
            const favor = await this.favorService.create(createFavorDto)
            createFavorDto.userIdList.push(user?.id);
            const favorUserAssociationPromises = createFavorDto.userIdList.map(async (userId) => {
                const groupUserAssociation = await this.groupUserAssociationService.findOne({groupId: createFavorDto.groupId, userId: userId})
                const createFavorUserAssociationDto: CreateFavorUserAssociationDto = {
                    groupId: createFavorDto.groupId,
                    userId: userId,
                    favorId: favor.id,
                    isCreator: userId === user?.id,
                    nickName: groupUserAssociation.nickName,
                    fileUrl: groupUserAssociation.fileUrl
                };
                return this.favorUserAssociationService.create(createFavorUserAssociationDto);
            });
            const favorUserAssociationList = await Promise.all(favorUserAssociationPromises);
            const group = await this.groupService.findOne(createFavorDto.groupId)
            const notificationPromises = favorUserAssociationList
                .filter((favorUserAssociation) => !favorUserAssociation.isCreator)
                .map(async (favorUserAssociation) => {
                const createNotificationDto: CreateNotificationDto = {
                    userId: favorUserAssociation.userId,
                    type: 'favor',
                    parameterText: `${group.name}`,
                }
                return this.notificationService.create(createNotificationDto);
            });
            await Promise.all(notificationPromises);
        } catch (error) {
            throw new InternalServerErrorException('서버오류입니다');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateFavorDto: UpdateFavorDto, @Req() request: Request): Promise<void> {
        const user = await this.authService.getUserFromAccessToken(request)
        const newUpdateFavorDto: UpdateFavorDto = {
            title: updateFavorDto.title,
            detail: updateFavorDto.detail,
            isImportant: updateFavorDto.isImportant,
        }
        await this.favorService.update(id, newUpdateFavorDto)

        const favorUserAssociationList = await this.favorUserAssociationService.getList({favorId: id})

        const createPromises = [];

        const notUpdatedFavorUserAssociationIdList = [];

        for (const userId of updateFavorDto.userIdList) {
            const favorUserAssociation = favorUserAssociationList.find(favorUserAssociation =>
                favorUserAssociation.userId === userId &&
                favorUserAssociation.groupId === updateFavorDto.groupId &&
                favorUserAssociation.favorId === id
            );

            if (!favorUserAssociation) {
                const groupUserAssociation = await this.groupUserAssociationService.findOne({groupId: updateFavorDto.groupId, userId: userId})
                const createFavorUserAssociationDto: CreateFavorUserAssociationDto = {
                    userId: userId,
                    groupId: updateFavorDto.groupId,
                    favorId: id,
                    isCreator: userId === user?.id,
                    nickName: groupUserAssociation.nickName,
                    fileUrl: groupUserAssociation.fileUrl
                };
                // 생성해야 하는 작업을 Promises 배열에 추가
                createPromises.push(this.favorUserAssociationService.create(createFavorUserAssociationDto));
            } else {
                notUpdatedFavorUserAssociationIdList.push(favorUserAssociation.id);
            }
        }

        await Promise.all(createPromises);

        const deletePromises = [];

        const needToDeleteFavorUserAssociationIdList = favorUserAssociationList.filter(favorUserAssociation => !notUpdatedFavorUserAssociationIdList.includes(favorUserAssociation.id));

        for (const favorUserAssociation of needToDeleteFavorUserAssociationIdList) {
            deletePromises.push(this.favorUserAssociationService.softDelete(favorUserAssociation.id));
        }

        await Promise.all(deletePromises);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    async getMyList(@Req() request: Request, @Query('type') type: string, @Query('groupId') groupId: number): Promise<Favor[]>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            return await this.favorService.getMyList(type, user?.id, groupId)
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('서버오류입니다');
        }
    }

    /*@UseGuards(AuthGuard('jwt'))
    @Delete('/delete/:id')
    async softDelete(@Param('id') id: number): Promise<void> {
        await this.favorService.softDelete(id)
        const groupUserAssociation = await this.favorUserAssociationService.findOne({groupId: id})
        console.log('groupUserAssociation', groupUserAssociation);
        await this.favorUserAssociationService.softDelete(groupUserAssociation.id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.favorService.delete(id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    async getMyList(@Req() request: Request): Promise<Group[]>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            console.log('user?.id', user?.id);
            return await this.favorService.getMyList(user?.id)
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('서버오류입니다');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me/:id')
    async getMy(@Param('id') id: number, @Req() request: Request): Promise<Group>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            console.log('user?.id', user?.id);
            return await this.favorService.getMy(id, user?.id)
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('서버오류입니다');
        }
    }*/
}
