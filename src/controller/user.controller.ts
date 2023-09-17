import { Body, ConflictException, Controller, Get, InternalServerErrorException, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import {User} from "../entity/user.entity";
import {CreateUserDto} from "../dto/createUser.dto";
import {ResponseDto} from "../dto/response.dto";
import {UserIdDuplicationDto} from "../dto/userIdDuplication.dto";
import {PhoneDuplicationDto} from "../dto/phoneDuplication.dto";
import {LoginRequestDto} from "../dto/loginRequest.dto";
import {AuthService} from "../auth/auth.service";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";

@Controller('/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,  // 의존성 주입
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll(): Promise<ResponseDto<User[]>> {
        const userList = await this.userService.findAll()
        return new ResponseDto(userList, true, 200, 'success');
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
    async create(@Body() dto: CreateUserDto): Promise<ResponseDto<void>>{
        try {
            await this.userService.create(dto)
            return new ResponseDto(null, true, 200, 'success');
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                throw new ConflictException('이미 가입된 아이디입니다');
            } else {
                throw new InternalServerErrorException('서버오류입니다');
            }
        }
    }

    @Post('/login')
    logIn(@Body() data: LoginRequestDto) {
        return this.authService.jwtLogin(data);
    }

    @Get('/current')
    async findOneByAccessToken(@Req() request: Request): Promise<ResponseDto<User>> {
        return new ResponseDto(await this.authService.getUserFromAccessToken(request), true, 200, 'success')
    }
}
