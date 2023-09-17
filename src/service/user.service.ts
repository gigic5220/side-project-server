import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import {CreateUserDto} from "../dto/createUser.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }

    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOneById(id: number): Promise<User | null> {
        return this.userRepository.findOneBy({ id });
    }

    findOneByUserId(userId: string): Promise<User | null> {
        return this.userRepository.findOneBy({ userId });
    }

    findOneByPhone(phone: string): Promise<User | null> {
        return this.userRepository.findOneBy({ phone });
    }

    async create(dto: CreateUserDto): Promise<void> {
        if (dto.provider === 'kakao') {
            dto.isActive = false
        } else {
            dto.password = await this.hashPassword(dto.password)
        }
        await this.userRepository.save(dto);
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}