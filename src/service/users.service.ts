import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import {CreateUserDto} from "../dto/createUser.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }
    findOneByUserId(userId: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ userId });
    }

    findOneByPhone(phone: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ phone });
    }

    async create(dto: CreateUserDto): Promise<void> {
        await this.usersRepository.save(dto);
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}