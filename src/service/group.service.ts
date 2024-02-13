import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Group} from "../entity/group.entity";
import {CreateGroupDto} from "../dto/createGroup.dto";
import {UpdateGroupDto} from "../dto/updateGroup.dto";
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
        @InjectRepository(GroupUserAssociation)
        private groupUserAssociationRepository: Repository<GroupUserAssociation>,
    ) {}

    findOne(id: number): Promise<Group> {
        return this.groupRepository.findOne({ where: {id}, order: { id: 'DESC'} });
    }

    async getMyList(userId: number): Promise<Group[]> {
        return this.groupRepository
            .createQueryBuilder("group")
            .leftJoinAndSelect("group.groupUserAssociations", "groupUserAssociation")
            .where("groupUserAssociation.userId = :userId", { userId })
            .andWhere("group.deletedAt IS NULL") // soft-deleted groups are excluded
            .select([
                "group.id",
                "group.name",
                "group.code",
                "group.createdAt",
                "group.updatedAt",
                "groupUserAssociation.id",
                "groupUserAssociation.userId",
                "groupUserAssociation.nickName",
                "groupUserAssociation.fileUrl",
                "groupUserAssociation.createdAt",
                "groupUserAssociation.updatedAt"
            ])
            .getMany();
    }

    async getMy(id: number, userId: number): Promise<Group> {
        return this.groupRepository
            .createQueryBuilder("group")
            .leftJoinAndSelect("group.groupUserAssociations", "groupUserAssociation")
            .where("group.id = :id", { id })
            .andWhere("groupUserAssociation.userId = :userId", { userId })
            .andWhere("group.deletedAt IS NULL") // soft-deleted groups are excluded
            .select([
                "group.id",
                "group.name",
                "group.code",
                "group.createdAt",
                "group.updatedAt",
                "groupUserAssociation.id",
                "groupUserAssociation.userId",
                "groupUserAssociation.nickName",
                "groupUserAssociation.fileUrl",
                "groupUserAssociation.createdAt",
                "groupUserAssociation.updatedAt"
            ])
            .getOne();
    }

    async create(createGroupDto: CreateGroupDto): Promise<Group> {
        let group = null;
        // 고유한 코드 생성
        let isSaved = false;
        while (!isSaved) {
            try {
                createGroupDto.code = this.generateRandomCode();
                group = await this.groupRepository.save(createGroupDto);
                isSaved = true;
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    createGroupDto.code = this.generateRandomCode();
                    group = await this.groupRepository.save(createGroupDto);
                    isSaved = true;
                } else {
                    // 기타 오류 처리
                    throw error;
                }
            }
        }
        return group;
    }

    async update(id: number, updateGroupDto: UpdateGroupDto): Promise<void> {
        await this.groupRepository.update(id, updateGroupDto)
    }

    async softDelete(id: number): Promise<void> {
        await this.groupRepository.softDelete(id)
    }

    async delete(id: number): Promise<void> {
        await this.groupRepository.delete(id)
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