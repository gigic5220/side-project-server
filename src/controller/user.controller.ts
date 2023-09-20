import {
    Body,
    ConflictException,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Post, Put,
    Req,
    UseGuards
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import {User} from "../entity/user.entity";
import {CreateUserDto} from "../dto/createUser.dto";
import {UserIdDuplicationDto} from "../dto/userIdDuplication.dto";
import {PhoneDuplicationDto} from "../dto/phoneDuplication.dto";
import {LoginRequestDto} from "../dto/loginRequest.dto";
import {AuthService} from "../auth/auth.service";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {UpdateUserDto} from "../dto/updateUser.dto";

@Controller('/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,  // 의존성 주입
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll(): Promise<User[]> {
        return await this.userService.findAll()
    }

    @Post()
    async create(@Body() dto: CreateUserDto): Promise<void>{
        try {
            await this.userService.create(dto)
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                throw new ConflictException('이미 가입된 아이디입니다');
            } else {
                throw new InternalServerErrorException('서버오류입니다');
            }
        }
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() dto: UpdateUserDto): Promise<void> {
        await this.userService.update(id, dto)
    }

    @Post('/userId/duplication')
    async getUserIdDuplication(@Body() dto: UserIdDuplicationDto): Promise<{ isDuplicated: boolean }> {
        return {isDuplicated: !!await this.userService.findOneByUserId(dto.userId)}
    }

    @Post('/phone/duplication')
    async getPhoneDuplication(@Body() dto: PhoneDuplicationDto): Promise<{isDuplicated: boolean}> {
        return {isDuplicated: !!await this.userService.findOneByPhone(dto.phone)}
    }



    @Post('/login')
    logIn(@Body() data: LoginRequestDto) {
        console.log('data', data)
        return this.authService.jwtLogin(data);
    }
    @Get('/current')
    async getCurrentUser(@Req() request: Request): Promise<User> {
        return await this.authService.getUserFromAccessToken(request)
    }


}
