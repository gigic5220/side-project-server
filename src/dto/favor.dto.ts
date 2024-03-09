import {Favor} from "../entity/favor.entity";
import {FavorUserAssociation} from "../entity/favorUserAssociation.entity";
import {GroupUserAssociation} from "../entity/groupUserAssociation.entity";

export class FavorDto {
    id: number;
    title: string;
    detail: string;
    isImportant: boolean;
    createdAt: Date;
    updatedAt: Date;
    groupId: number;
    creatorId: number;
    favorUserAssociationList: FavorUserAssociation[];
    groupUserAssociation?: GroupUserAssociation[];

    constructor(favor: Favor, groupUserAssociationList?: GroupUserAssociation[]) {
        this.id = favor.id;
        this.title = favor.title;
        this.detail = favor.detail;
        this.isImportant = favor.isImportant;
        this.createdAt = favor.createdAt;
        this.updatedAt = favor.updatedAt;
        this.groupId = favor.groupId;
        this.creatorId = favor.creatorId;
        this.favorUserAssociationList = favor.favorUserAssociations;
        this.groupUserAssociation = groupUserAssociationList;
    }
}