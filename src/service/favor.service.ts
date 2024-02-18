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

    async getMyList(userId: number): Promise<FavorDto[]> {
        const favorList = await this.favorRepository
            .createQueryBuilder("favor")
            .leftJoinAndSelect("favor.favorUserAssociations", "favorUserAssociation")
            .leftJoinAndSelect("favorUserAssociation.user", "user")
            .where("favorUserAssociation.userId = :userId", { userId })
            .andWhere("favor.deletedAt IS NULL")
            .select([
                "favor.id",
                "favor.title",
                "favor.detail",
                "favor.createdAt",
                "favor.updatedAt",
                "favor.groupId",
                "favor.creatorId",
                "favorUserAssociation.id",
                "favorUserAssociation.userId",
                "favorUserAssociation.favorId",
                "favorUserAssociation.groupId",
                "favorUserAssociation.createdAt",
                "favorUserAssociation.updatedAt",
            ])
            .getMany();

        // FavorDto[]를 생성하기 위한 결과 배열
        const favorDtoList: FavorDto[] = [];

        for (const favor of favorList) {
            const groupUserAssociation = await this.groupUserAssociationRepository.findOne({
                where: { groupId: favor.groupId, userId: userId }
            });

            // GroupUserAssociation 정보를 바탕으로 FavorDto 인스턴스 생성
            const favorDto = new FavorDto(favor, groupUserAssociation);
            favorDtoList.push(favorDto);

        }

        return favorDtoList;
    }
}