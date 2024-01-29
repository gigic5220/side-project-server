import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Group} from "../entity/group.entity";

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private GroupRepository: Repository<Group>,
    ) {}

    findOne(id: number): Promise<Group> {
        return this.GroupRepository.findOne({ where: {id}, order: { id: 'DESC'} });
    }

    getMyGroupList(id: number): Promise<Group[]> {
        return this.GroupRepository.find({ where: {id}, order: { id: 'DESC'} });
    }

    async create(dto: any): Promise<void> {
        console.log('dto', dto);
        await this.GroupRepository.save(dto);
    }
}