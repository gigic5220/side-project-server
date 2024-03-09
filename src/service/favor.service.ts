import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";
import {Favor} from "../entity/favor.entity";
import {CreateFavorDto} from "../dto/createFavor.dto";
import {UpdateFavorDto} from "../dto/updateFavor.dto";
import {FavorUserAssociation} from "../entity/favorUserAssociation.entity";

@Injectable()
export class FavorService {
    constructor(
        @InjectRepository(Favor)
        private favorRepository: Repository<Favor>,
        @InjectRepository(FavorUserAssociation)
        private favorUserAssociationRepository: Repository<FavorUserAssociation>,
        @InjectRepository(GroupUserAssociation)
        private groupUserAssociationRepository: Repository<GroupUserAssociation>,
    ) {}

    findOne(id: number): Promise<Favor> {
        return this.favorRepository.findOne({ where: {id}, order: { id: 'DESC'} });
    }

    async create(createFavorDto: CreateFavorDto): Promise<Favor> {
        return await this.favorRepository.save(createFavorDto);
    }

    async update(id: number, updateFavorDto: UpdateFavorDto): Promise<void> {
        await this.favorRepository.update(id, updateFavorDto)
    }

    async softDelete(id: number): Promise<void> {
        await this.favorRepository.softDelete(id)
    }

    async delete(id: number): Promise<void> {
        await this.favorRepository.delete(id)
    }

    async getMyList(type: string, userId: number, groupId: number): Promise<Favor[]> {
        let queryBuilder = this.favorRepository
            .createQueryBuilder('favor')
            .leftJoinAndSelect('favor.favorUserAssociations', 'favorUserAssociation')
            .where('favor.groupId = :groupId', { groupId })
        if (type === 'received') {
            queryBuilder = queryBuilder
                .andWhere('favor.creatorId != :userId', { userId })
                .andWhere('favorUserAssociation.favorId = favor.id')
                .andWhere('favorUserAssociation.userId = :userId', { userId });
        } else {
            queryBuilder = queryBuilder
                .andWhere('favor.creatorId = :userId', { userId })
                .andWhere('favorUserAssociation.favorId = favor.id')
                .andWhere('favorUserAssociation.userId != :userId', { userId });
        }
        return await queryBuilder.getMany();
    }
}