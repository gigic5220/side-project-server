import {Injectable, UnauthorizedException} from '@nestjs/common';
import {LoginRequestDto} from "../dto/loginRequest.dto";
import {JwtService} from "@nestjs/jwt";
import { UserService } from '../service/user.service';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entity/user.entity";
import {Repository} from "typeorm";
import {TokenService} from "../service/token.service";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private userService: UserService,
        private tokenService: TokenService,
        private readonly configService: ConfigService,
    ) {}

    async jwtLogin(data: LoginRequestDto) {
        const { userId, password } = data;
        const user = await this.userRepository.findOneBy({ userId });
        if (!user) {
            throw new UnauthorizedException('아이디와 비밀번호를 확인해 주세요');
        }

        const isPasswordMatch = await this.userService.comparePasswords(password, user.password)

        if (!isPasswordMatch) {
            throw new UnauthorizedException('아이디와 비밀번호를 확인해 주세요');
        }
        const accessTokenPayload = { sub: user.userId, type: 'access' };
        const refreshTokenPayload = { sub: user.userId, type: 'access' };

        const accessToken = this.jwtService.sign(accessTokenPayload,{ expiresIn: '2s', secret: this.configService.get('JWT_SECRET_KEY') });

        const nowInMilliseconds = new Date().getTime()

        //now.setMilliseconds(now.getMilliseconds() + 5 * 60 * 1000)

        const accessTokenExpireAt = nowInMilliseconds + 5 * 1000
        const refreshToken = this.jwtService.sign(refreshTokenPayload,{ expiresIn: '5s', secret: this.configService.get('JWT_SECRET_KEY') });

        await this.tokenService.create({
            refreshToken: refreshToken,
            userId: user.id
        })

        return {
            id: user.id,
            userId: user.userId,
            isActive: user.isActive,
            accessToken: accessToken,
            accessTokenExpireAt: accessTokenExpireAt,
            refreshToken: refreshToken,
        };
    }
}
