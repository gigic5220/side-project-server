import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {RefreshToken} from "./refreshToken.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    phone: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken[];
}