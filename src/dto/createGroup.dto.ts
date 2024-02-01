import {User} from "../entity/user.entity";

export class CreateGroupDto {
    name: string;
    userId: number;
    nickName: string;
    fileUrl: string;
    code: string;
}