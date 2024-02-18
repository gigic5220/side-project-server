export class CreateFavorDto {
    creatorId: number;
    title: string;
    detail: string;
    groupId?: number;
    userIdList?: number[];
}