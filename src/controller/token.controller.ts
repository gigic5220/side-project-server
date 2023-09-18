import {Body, Controller, ForbiddenException, Post} from '@nestjs/common';
import {TokenService} from "../service/token.service";
import {RefreshTokenDto} from "../dto/refreshToken.dto";
import {UserService} from "../service/user.service";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";

interface JwtPayload {
    sub: string;
}

@Controller('/token')
export class TokenController {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {}

    @Post('/refresh')
    async create(@Body() dto: RefreshTokenDto): Promise<{ accessToken: string }> {
        const secret = await this.configService.get('JWT_SECRET_KEY');
        try {
            const verified = this.jwtService.verify(dto.refreshToken, {secret: secret});
            const user = await this.userService.findOneByUserId(verified.sub);

            if (!user) {
                throw new ForbiddenException('User not found');
            }

            const tokenRecord = await this.tokenService.findOne(dto.refreshToken);
            if (!tokenRecord || tokenRecord.userId !== user.id) {
                throw new ForbiddenException('Invalid refresh token');
            }

            const accessToken = this.jwtService.sign({sub: user.userId}, {expiresIn: '5s', secret: secret});
            return {accessToken};

        } catch (error) {
            console.error('Token verification failed:', error.message);
            throw new ForbiddenException('Invalid or expired token');
        }
    }
}