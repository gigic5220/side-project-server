export class CreateUserDto {
    userId: string;
    phone: string;
    password: string;
    provider: string;
    isActive: boolean;
}