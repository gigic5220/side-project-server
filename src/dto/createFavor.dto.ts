export class CreateFavorDto {
    creatorId: number;
    title: string;
    detail: string;
    isImportant: boolean;
    groupId?: number;
    userIdList?: number[];
}