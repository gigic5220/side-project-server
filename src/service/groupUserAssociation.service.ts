import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";
import {CreateGroupUserAssociationDto} from "../dto/createGroupUserAssociation.dto";

@Injectable()
export class GroupUserAssociationService {
    constructor(
        @InjectRepository(GroupUserAssociation)
        private groupUserAssociationRepository: Repository<GroupUserAssociation>,
    ) {}

    findOne(id: number): Promise<GroupUserAssociation> {
        return this.groupUserAssociationRepository.findOne({ where: {id}, order: { id: 'DESC'} });
    }

    getList(id: number): Promise<GroupUserAssociation[]> {
        return this.groupUserAssociationRepository.find({ where: {id}, order: { id: 'DESC'} });
    }

    async create(dto: CreateGroupUserAssociationDto): Promise<void> {
        await this.groupUserAssociationRepository.save(dto);
    }
}