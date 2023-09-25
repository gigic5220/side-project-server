import {Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context) {
        // JWT 토큰이 유효하지 않거나 만료된 경우, 여기서 에러 처리를 수행합니다.
        if (err || !user) {
            throw err || new UnauthorizedException('로그인이 필요한 서비스입니다');
        }
        return user;
    }
}