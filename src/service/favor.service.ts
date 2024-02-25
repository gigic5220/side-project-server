import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Group} from "../entity/group.entity";
import {CreateGroupDto} from "../dto/createGroup.dto";
import {UpdateGroupDto} from "../dto/updateGroup.dto";
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";
import {Favor} from "../entity/favor.entity";
import {CreateFavorDto} from "../dto/createFavor.dto";
import {UpdateFavorDto} from "../dto/updateFavor.dto";
import {FavorUserAssociation} from "../entity/favorUserAssociation.entity";
import {FavorDto} from "../dto/favor.dto";

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

    async getMyList(type: string, userId: number): Promise<FavorDto[]> {
        let queryBuilder = this.favorRepository
            .createQueryBuilder("favor")
            .leftJoinAndSelect("favor.favorUserAssociations", "favorUserAssociation")
            .leftJoinAndSelect("favorUserAssociation.user", "user")
            .where("favor.deletedAt IS NULL")
            .select([
                "favor.id",
                "favor.title",
                "favor.detail",
                "favor.createdAt",
                "favor.updatedAt",
                "favor.groupId",
                "favor.creatorId",
                "favor.isImportant",
                "favorUserAssociation.id",
                "favorUserAssociation.userId",
                "favorUserAssociation.favorId",
                "favorUserAssociation.isComplete",
                "favorUserAssociation.groupId",
                "favorUserAssociation.createdAt",
                "favorUserAssociation.updatedAt",
            ]);

        if (type === 'received') {
            queryBuilder = queryBuilder.andWhere("favorUserAssociation.userId = :userId", { userId });
        } else if (type === 'sent') {
            queryBuilder = queryBuilder
                .andWhere("favorUserAssociation.userId != :userId", { userId })
                .andWhere("favor.creatorId = :userId", { userId });
        }

        const favorList = await queryBuilder.getMany();

        const favorDtoList: FavorDto[] = [];

        for (const favor of favorList) {
            let currentUserId : number;
            if (type === 'received') {
                currentUserId = favor.creatorId;
            } else {
                currentUserId = userId;
            }

            const groupUserAssociation = await this.groupUserAssociationRepository.findOne({
                where: { groupId: favor.groupId, userId: userId }
            });

            const favorDto = new FavorDto(favor, groupUserAssociation);
            favorDtoList.push(favorDto);

        }

        return favorDtoList;
    }
}