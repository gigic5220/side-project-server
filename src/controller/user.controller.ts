import {
    Body,
    ConflictException,
    Controller, Delete,
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
import {PhoneDuplicationDto} from "../dto/phoneDuplication.dto";
import {LoginRequestDto} from "../dto/loginRequest.dto";
import {AuthService} from "../auth/auth.service";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {UpdateUserDto} from "../dto/updateUser.dto";
import {JwtAuthGuard} from "../auth/jwt/jwt.guard";

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

    // 회원가입
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

    @Post('/phone/duplication')
    async getPhoneDuplication(@Body() dto: PhoneDuplicationDto): Promise<{isDuplicated: boolean}> {
        return {isDuplicated: !!await this.userService.findOneByPhone(dto.phone)}
    }

    @Post('/login')
    logIn(@Body() data: LoginRequestDto) {
        return this.authService.jwtLogin(data);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/current')
    async getCurrentUser(@Req() request: Request): Promise<User> {
        return await this.authService.getUserFromAccessToken(request)
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        return await this.userService.delete(id);
    }
}
