import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Group} from "../entity/group.entity";
import {CreateGroupDto} from "../dto/createGroup.dto";

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
    ) {}

    findOne(id: number): Promise<Group> {
        return this.groupRepository.findOne({ where: {id}, order: { id: 'DESC'} });
    }

    getMyGroupList(id: number): Promise<Group[]> {
        return this.groupRepository.find({ where: {id}, order: { id: 'DESC'} });
    }

    async create(createGroupDto: CreateGroupDto): Promise<Group> {
        let group = null;
        // 고유한 코드 생성
        let isSaved = false;
        while (!isSaved) {
            try {
                const code = this.generateRandomCode();
                createGroupDto.code = code;
                group = await this.groupRepository.save(createGroupDto);
                isSaved = true;
            } catch (error) {
                isSaved = true;
                if (error.code === 'ER_DUP_ENTRY') {

                } else {
                    // 기타 오류 처리
                    throw error;
                }
            }
        }
        return group;
    }

    generateRandomCode(length = 6) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}