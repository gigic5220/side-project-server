export class UpdateFavorDto {
    title: string;
    detail: string;
    isImportant: boolean;
    groupId?: number;
    userIdList?: number[];
}