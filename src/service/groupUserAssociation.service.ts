import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";
import {CreateGroupUserAssociationDto} from "../dto/createGroupUserAssociation.dto";
import {UpdateGroupUserAssociationDto} from "../dto/updateGroupUserAssociation.dto";

@Injectable()
export class GroupUserAssociationService {
    constructor(
        @InjectRepository(GroupUserAssociation)
        private groupUserAssociationRepository: Repository<GroupUserAssociation>,
    ) {}

    findOne(params: any): Promise<GroupUserAssociation> {
        return this.groupUserAssociationRepository.findOne({ where: params, order: { id: 'DESC'} });
    }

    getList(id: number): Promise<GroupUserAssociation[]> {
        return this.groupUserAssociationRepository.find({ where: {id}, order: { id: 'DESC'} });
    }

    async create(dto: CreateGroupUserAssociationDto): Promise<void> {
        await this.groupUserAssociationRepository.save(dto);
    }

    async update(id: number, updateGroupDto: UpdateGroupUserAssociationDto): Promise<void> {
        await this.groupUserAssociationRepository.update(id, updateGroupDto)
    }

    async softDelete(id: number): Promise<void> {
        await this.groupUserAssociationRepository.softDelete(id)
    }

    async delete(id: number): Promise<void> {
        await this.groupUserAssociationRepository.delete(id)
    }
}