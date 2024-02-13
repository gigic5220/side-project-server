import {Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, Req} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {Request} from "express";
import {GroupService} from "../service/group.service";
import {Group} from "../entity/group.entity";
import {CreateGroupDto} from "../dto/createGroup.dto";
import {GroupUserAssociationService} from "../service/groupUserAssociation.service";
import {CreateGroupUserAssociationDto} from "../dto/createGroupUserAssociation.dto";
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";
import {UpdateGroupDto} from "../dto/updateGroup.dto";
import {UpdateGroupUserAssociationDto} from "../dto/updateGroupUserAssociation.dto";

@Controller('/groupUserAssociation')
export class GroupUserAssociationController {
    constructor(
        private readonly groupUserAssociationService: GroupUserAssociationService,
        private readonly authService: AuthService,
    ) {}

    //@UseGuards(AuthGuard('jwt'))
    @Get()
    async getList(@Req() request: Request): Promise<GroupUserAssociation[]> {
        const user = await this.authService.getUserFromAccessToken(request)
        return await this.groupUserAssociationService.getList(user?.id)
    }

    //@UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() createGroupUserAssociationDto: CreateGroupUserAssociationDto, @Req() request: Request): Promise<void>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            createGroupUserAssociationDto.userId = user?.id
            await this.groupUserAssociationService.create(createGroupUserAssociationDto)
        } catch (error) {
            throw new InternalServerErrorException('서버오류입니다');
        }
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateGroupUserAssociationDto: UpdateGroupUserAssociationDto): Promise<void> {
        await this.groupUserAssociationService.update(id, updateGroupUserAssociationDto)
    }

    @Put('/delete/:id')
    async softDelete(@Param('id') id: number): Promise<void> {
        await this.groupUserAssociationService.softDelete(id)
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.groupUserAssociationService.delete(id)
    }
}
