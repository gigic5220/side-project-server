import {Body, Controller, Get, InternalServerErrorException, Post, Req} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {Request} from "express";
import {GroupService} from "../service/group.service";
import {Group} from "../entity/group.entity";
import {CreateGroupDto} from "../dto/createGroup.dto";

@Controller('/group')
export class GroupController {
    constructor(
        private readonly groupService: GroupService,
        private readonly authService: AuthService,
    ) {}

    //@UseGuards(AuthGuard('jwt'))
    @Get()
    async getMyGroupList(@Req() request: Request): Promise<Group[]> {
        const user = await this.authService.getUserFromAccessToken(request)
        return await this.groupService.getMyGroupList(user?.id)
    }

    @Post()
    async create(@Body() dto: CreateGroupDto, @Req() request: Request): Promise<void>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            console.log('user', user);
            console.log('dto', dto);
            await this.groupService.create({
                ...dto,
                participants: [user]
            })
        } catch (error) {
            throw new InternalServerErrorException('서버오류입니다');
        }
    }
}
