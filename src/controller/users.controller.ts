import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import {User} from "../entity/user.entity";
import {CreateUserDto} from "../dto/createUser.dto";
import {ResponseDto} from "../dto/response.dto";
import {UserIdDuplicationDto} from "../dto/userIdDuplication.dto";
import {PhoneDuplicationDto} from "../dto/phoneDuplication.dto";
import {LoginRequestDto} from "../dto/loginRequest.dto";
import {AuthService} from "../auth/auth.service";

@Controller('/users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService,  // 의존성 주입
    ) {}

    @Get()
    findAll(): ResponseDto<Promise<User[]>> {
        return new ResponseDto(this.userService.findAll(), true, 200, 'success');
    }

    @Get(':id')
    findOne(@Param('id')id: string): string {
        return `This action returns a #${id} user`;
    }

    @Post('/userId/duplication')
    async findOneByUserId(@Body() dto: UserIdDuplicationDto): Promise<ResponseDto<boolean>> {
        const user = await this.userService.findOneByUserId(dto.userId)
        return new ResponseDto(!!user, true, 200, 'success')
    }

    @Post('/phone/duplication')
    async findOneByPhone(@Body() dto: PhoneDuplicationDto): Promise<ResponseDto<boolean>> {
        const user = await this.userService.findOneByPhone(dto.phone)
        return new ResponseDto(!!user, true, 200, 'success')
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

    @Post('/login')
    logIn(@Body() data: LoginRequestDto) {
        return this.authService.jwtLogin(data);
    }
}
