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
import {Group} from "../entity/group.entity";
import {CreateGroupDto} from "../dto/createGroup.dto";
import {GroupUserAssociationService} from "../service/groupUserAssociation.service";
import {CreateGroupUserAssociationDto} from "../dto/createGroupUserAssociation.dto";
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";
import {UpdateGroupDto} from "../dto/updateGroup.dto";
import {UpdateGroupUserAssociationDto} from "../dto/updateGroupUserAssociation.dto";
import {FavorUserAssociationService} from "../service/favorUserAssociation.service";
import {FavorUserAssociation} from "../entity/favorUserAssociation.entity";
import {AuthGuard} from "@nestjs/passport";
import {CreateFavorUserAssociationDto} from "../dto/createFavorUserAssociation.dto";
import {UpdateFavorUserAssociationDto} from "../dto/updateFavorUserAssociation.dto";

@Controller('/favorUserAssociation')
export class FavorUserAssociationController {
    constructor(
        private readonly favorUserAssociationService: FavorUserAssociationService,
        private readonly authService: AuthService,
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getList(@Req() request: Request): Promise<FavorUserAssociation[]> {
        const user = await this.authService.getUserFromAccessToken(request)
        return await this.favorUserAssociationService.getList({userId: user?.id})
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() createFavorUserAssociationDto: CreateFavorUserAssociationDto, @Req() request: Request): Promise<void>{
        try {
            const user = await this.authService.getUserFromAccessToken(request)
            createFavorUserAssociationDto.userId = user?.id
            await this.favorUserAssociationService.create(createFavorUserAssociationDto)
        } catch (error) {
            throw new InternalServerErrorException('서버오류입니다');
        }
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateFavorUserAssociationDto: UpdateFavorUserAssociationDto): Promise<void> {
        await this.favorUserAssociationService.update(id, updateFavorUserAssociationDto)
    }

    @Put('/delete/:id')
    async softDelete(@Param('id') id: number): Promise<void> {
        await this.favorUserAssociationService.softDelete(id)
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.favorUserAssociationService.delete(id)
    }
}
