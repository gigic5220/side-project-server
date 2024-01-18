import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {RefreshToken} from "./refreshToken.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    phone: string;

    @Column({nullable: true})
    provider: string;

    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken[];
}