import {
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Req,
    UseGuards
} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {Request} from "express";
import {GroupService} from "../service/group.service";
import {CreateGroupDto} from "../dto/createGroup.dto";
import {GroupUserAssociationService} from "../service/groupUserAssociation.service";
import {CreateGroupUserAssociationDto} from "../dto/createGroupUserAssociation.dto";
import {UpdateUserDto} from "../dto/updateUser.dto";
import {UpdateGroupDto} from "../dto/updateGroup.dto";
import {AuthGuard} from "@nestjs/passport";
import {Group} from "../entity/group.entity";
import {UpdateGroupUserAssociationDto} from "../dto/updateGroupUserAssociation.dto";
import {UpdateResult} from "typeorm";
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";
import {FavorService} from "../service/favor.service";
import {FavorUserAssociationService} from "../service/favorUserAssociation.service";
import {CreateFavorDto} from "../dto/createFavor.dto";
import {CreateFavorUserAssociationDto} from "../dto/createFavorUserAssociation.dto";
import {UpdateFavorDto} from "../dto/updateFavor.dto";
import {UpdateFavorUserAssociationDto} from "../dto/updateFavorUserAssociation.dto";
import {Favor} from "../entity/favor.entity";
import {FavorDto} from "../dto/favor.dto";

@Controller('/favor')
export class FavorController {
    constructor(
        private readonly favorService: FavorService,
        private readonly favorUserAssociationService: FavorUserAssociationService,
        private readonly authService: AuthService,
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() createFavorDto: CreateFavorDto, @Req() request: Request): Promise<void>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            createFavorDto.creatorId = user?.id
            const favor = await this.favorService.create(createFavorDto)

            const favorUserAssociationPromises = createFavorDto.userIdList.map(userId => {
                const createFavorUserAssociationDto: CreateFavorUserAssociationDto = {
                    groupId: createFavorDto.groupId,
                    userId: userId,
                    favorId: favor.id
                };
                return this.favorUserAssociationService.create(createFavorUserAssociationDto);
            });

            await Promise.all(favorUserAssociationPromises);
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
            detail: updateFavorDto.detail
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
                const createFavorUserAssociationDto: CreateFavorUserAssociationDto = {
                    userId: userId,
                    groupId: updateFavorDto.groupId,
                    favorId: id
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
    async getMyList(@Req() request: Request): Promise<FavorDto[]>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            return await this.favorService.getMyList(user?.id)
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
