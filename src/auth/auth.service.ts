import {Injectable, UnauthorizedException} from '@nestjs/common';
import {LoginRequestDto} from "../dto/loginRequest.dto";
import {JwtService} from "@nestjs/jwt";
import { UserService } from '../service/user.service';
import {TokenService} from "../service/token.service";
import {ConfigService} from "@nestjs/config";
import { Request } from 'express';
import {User} from "../entity/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private userService: UserService,
        private tokenService: TokenService,
        private readonly configService: ConfigService,
    ) {}

    async getUserFromAccessToken(request: Request): Promise<User> {
        const accessToken = request.headers['authorization']?.replace('Bearer ','');
        const secret = await this.configService.get('JWT_SECRET_KEY');
        const verifiedAccessToken = this.jwtService.verify(accessToken, {secret: secret});
        const user = await this.userService.findOneByUserId(verifiedAccessToken.sub)
        delete user.password
        return user
    }

    async jwtLogin(dto: LoginRequestDto) {
        const user = await this.userService.findOneByUserId(dto.userId);
        if (!user) {
            throw new UnauthorizedException('아이디와 비밀번호를 확인해 주세요');
        }
        if (dto.provider !== 'kakao') {
            const isPasswordMatch = await this.userService.comparePasswords(dto.password, user.password)
            if (!isPasswordMatch) {
                throw new UnauthorizedException('아이디와 비밀번호를 확인해 주세요');
            }
        }
        const accessTokenPayload = { sub: user.userId, type: 'access' };
        const refreshTokenPayload = { sub: user.userId, type: 'refresh' };

        const accessToken = this.jwtService.sign(accessTokenPayload,{ expiresIn: '30d', secret: this.configService.get('JWT_SECRET_KEY') });

        const nowInMilliseconds = new Date().getTime()

        const accessTokenExpireAt = nowInMilliseconds + 60 * 60 * 24 * 1000
        const refreshToken = this.jwtService.sign(refreshTokenPayload,{ expiresIn: '30d', secret: this.configService.get('JWT_SECRET_KEY') });

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
