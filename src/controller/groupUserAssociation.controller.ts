import {Body, Controller, Get, InternalServerErrorException, Post, Req} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {Request} from "express";
import {GroupService} from "../service/group.service";
import {Group} from "../entity/group.entity";
import {CreateGroupDto} from "../dto/createGroup.dto";
import {GroupUserAssociationService} from "../service/groupUserAssociation.service";
import {CreateGroupUserAssociationDto} from "../dto/createGroupUserAssociation.dto";
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";

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
    async create(@Body() createGroupDto: CreateGroupUserAssociationDto, @Req() request: Request): Promise<void>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            await this.groupUserAssociationService.create(createGroupDto)
        } catch (error) {
            throw new InternalServerErrorException('서버오류입니다');
        }
    }
}
