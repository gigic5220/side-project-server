import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';
import {GroupJoinRequest} from "../entity/groupJoinRequest.entity";
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";
import {CreateGroupJoinRequestDto} from "../dto/createGroupJoinRequest.dto";
import {UpdateGroupJoinRequestDto} from "../dto/updateGroupJoinRequest.dto";

@Injectable()
export class GroupJoinRequestService {
    constructor(
        @InjectRepository(GroupJoinRequest)
        private groupJoinRequestRepository: Repository<GroupJoinRequest>
    ) {}

    async create(createGroupJoinRequestDto: CreateGroupJoinRequestDto): Promise<GroupJoinRequest> {
        return await this.groupJoinRequestRepository.save(createGroupJoinRequestDto);
    }

    async update(id: number, updateGroupJoinRequestDto: UpdateGroupJoinRequestDto): Promise<UpdateResult> {
        return await this.groupJoinRequestRepository.update(id, updateGroupJoinRequestDto);
    }

    async softDelete(id: number): Promise<void> {
        await this.groupJoinRequestRepository.softDelete(id)
    }

    async delete(id: number): Promise<void> {
        await this.groupJoinRequestRepository.delete(id)
    }

    async get(id: number): Promise<GroupJoinRequest | undefined> {
        return await this.groupJoinRequestRepository.findOne({where: {id}});
    }


    async getMyList(userId: number): Promise<any> {
        const joinRequests = await this.groupJoinRequestRepository
            .createQueryBuilder("groupJoinRequest")
            .leftJoinAndSelect("groupJoinRequest.group", "group")
            .leftJoinAndSelect("groupJoinRequest.user", "user")
            .leftJoinAndSelect(GroupUserAssociation, "groupUserAssociation", "groupUserAssociation.groupId = group.id AND groupUserAssociation.userId = :userId", { userId })
            .where("groupJoinRequest.userId = :userId", { userId })
            .getMany();

        return joinRequests;
    }

}