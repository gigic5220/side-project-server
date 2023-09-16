import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entity/file.entity';
import {CreateFileDto} from "../dto/createFile.dto";

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File)
        private fileRepository: Repository<File>,
    ) {}

    findOne(userId: number, type: string): Promise<File> {
        return this.fileRepository.findOne({ where: {type, userId}, order: { id: 'DESC'} });
    }

    async create(dto: CreateFileDto): Promise<void> {
        await this.fileRepository.save(dto);
    }
}