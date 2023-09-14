import {Injectable, UnauthorizedException} from '@nestjs/common';
import {LoginRequestDto} from "../dto/loginRequest.dto";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entity/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly jwtService: JwtService,  // auth.module의 JwtModule로부터 공급 받음
    ) {}

    async jwtLogin(data: LoginRequestDto) {
        const { userId, password } = data;
        const user = await this.usersRepository.findOneBy({ userId });
        if (!user) {
            throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
        }
        const isPasswordValidated: boolean = await bcrypt.compare(
            password,
            user.password,
        );
        if (!isPasswordValidated) {
            console.log('isPasswordValidated', isPasswordValidated)
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }
        const payload = { userId, sub: user.userId };
        return {
            token: this.jwtService.sign(payload),
        };
    }
}
