import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import {User} from "../entity/user.entity";
import {CreateUserDto} from "../dto/createUser.dto";

type findOneRequestQuery = {
    id: number | null,
    email: string | null,
    phone: string | null,
    name: string | null
}
@Controller('/users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id')id: string): string {
        return `This action returns a #${id} user`;
    }

    @Get('/email/duplication')
    findOneByEmail(@Query() query: findOneRequestQuery): Promise<User> {
        console.log(query.email)
        return this.userService.findOneByEmail(query.email);
    }

    @Post()
    create(@Body() dto: CreateUserDto){
        console.log('dto', dto)
        return this.userService.create(dto);
    }

    @Delete(':id')
    async remove(@Param('id')id: number){
        await this.userService.remove(id);
        return `This action removes a #${id} cat`;
    }
}
