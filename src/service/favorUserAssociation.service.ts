import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {FavorUserAssociation} from "../entity/favorUserAssociation.entity";
import {CreateFavorUserAssociationDto} from "../dto/createFavorUserAssociation.dto";
import {UpdateFavorUserAssociationDto} from "../dto/updateFavorUserAssociation.dto";

@Injectable()
export class FavorUserAssociationService {
    constructor(
        @InjectRepository(FavorUserAssociation)
        private favorUserAssociationRepository: Repository<FavorUserAssociation>,
    ) {}

    findOne(params: { userId: number, favorId: number, groupId: number }): Promise<FavorUserAssociation> {
        return this.favorUserAssociationRepository.findOne({ where: params, order: { id: 'DESC'} });
    }

    getList(params: { favorId?: number, userId?: number }): Promise<FavorUserAssociation[]> {
        return this.favorUserAssociationRepository.find({ where: params, order: { id: 'DESC'} });
    }

    async create(createFavorUserAssociationDto: CreateFavorUserAssociationDto): Promise<void> {
        await this.favorUserAssociationRepository.save(createFavorUserAssociationDto);
    }

    async update(id: number, updateFavorUserAssociationDto: UpdateFavorUserAssociationDto): Promise<void> {
        await this.favorUserAssociationRepository.update(id, updateFavorUserAssociationDto)
    }

    async softDelete(id: number): Promise<void> {
        await this.favorUserAssociationRepository.softDelete(id)
    }

    async delete(id: number): Promise<void> {
        await this.favorUserAssociationRepository.delete(id)
    }
}