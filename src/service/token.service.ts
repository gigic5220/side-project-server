import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entity/refreshToken.entity';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
    ) {}

    findOne(refreshToken: string): Promise<RefreshToken | null> {
        return this.refreshTokenRepository.findOneBy({ refreshToken });
    }

    async create(refreshToken): Promise<void> {
        await this.refreshTokenRepository.save(refreshToken);
    }
}