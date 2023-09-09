import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import {User} from "../entity/user.entity";
import {CreateUserDto} from "../dto/createUser.dto";
import {ResponseDto} from "../dto/response.dto";

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
    findAll(): ResponseDto<Promise<User[]>> {
        return new ResponseDto(this.userService.findAll(), true, 200, 'success');
    }

    @Get(':id')
    findOne(@Param('id')id: string): string {
        return `This action returns a #${id} user`;
    }

    @Get('/email/duplication')
    async findOneByEmail(@Query() query: findOneRequestQuery): Promise<ResponseDto<User>> {
        const user = await this.userService.findOneByEmail(query.email)
        return new ResponseDto(user, true, 200, 'success')
    }

    @Post()
    create(@Body() dto: CreateUserDto): ResponseDto<Promise<void>>{
        return new ResponseDto(this.userService.create(dto), true, 200, 'success');
    }

    @Delete(':id')
    async remove(@Param('id')id: number){
        await this.userService.remove(id);
        return `This action removes a #${id} cat`;
    }
}
