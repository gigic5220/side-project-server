import {Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context) {
        if (err || !user) {
            throw err || new UnauthorizedException('로그인이 필요한 서비스입니다');
        }
        return user;
    }
}