import {
    Body,
    Controller,
    Delete,
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

@Controller('/group')
export class GroupController {
    constructor(
        private readonly groupService: GroupService,
        private readonly groupUserAssociationService: GroupUserAssociationService,
        private readonly authService: AuthService,
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() createGroupDto: CreateGroupDto, @Req() request: Request): Promise<void>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            createGroupDto.userId = user?.id
            const group = await this.groupService.create(createGroupDto)
            const createGroupUserAssociationDto: CreateGroupUserAssociationDto = {
                groupId: group.id,
                userId: group.userId,
                nickName: createGroupDto.nickName,
                fileUrl: createGroupDto.fileUrl
            }
            await this.groupUserAssociationService.create(createGroupUserAssociationDto)
        } catch (error) {
            throw new InternalServerErrorException('서버오류입니다');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateGroupDto: UpdateGroupDto, @Req() request: Request): Promise<void> {
        const user = await this.authService.getUserFromAccessToken(request)
        const newUpdateGroupDto: UpdateGroupDto = {
            name: updateGroupDto.name
        }
        await this.groupService.update(id, newUpdateGroupDto)
        const groupUserAssociation : GroupUserAssociation = await this.groupUserAssociationService.findOne({
            'groupId': id,
            'userId': user?.id
        })
        const updateGroupUserAssociationDto: UpdateGroupUserAssociationDto = {
            nickName: updateGroupDto.nickName,
            fileUrl: updateGroupDto.fileUrl
        }
        await this.groupUserAssociationService.update(groupUserAssociation.id, updateGroupUserAssociationDto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/delete/:id')
    async softDelete(@Param('id') id: number): Promise<void> {
        await this.groupService.softDelete(id)
        const groupUserAssociation = await this.groupUserAssociationService.findOne({groupId: id})
        console.log('groupUserAssociation', groupUserAssociation);
        await this.groupUserAssociationService.softDelete(groupUserAssociation.id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.groupService.delete(id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    async getMyList(@Req() request: Request): Promise<Group[]>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            console.log('user?.id', user?.id);
            return await this.groupService.getMyList(user?.id)
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('서버오류입니다');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    async getList(@Req() request: Request, @Query('inviteCode') inviteCode: string): Promise<Group[]>{
        try {
            return await this.groupService.getList(inviteCode)
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
            return await this.groupService.getMy(id, user?.id)
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('서버오류입니다');
        }
    }
}
