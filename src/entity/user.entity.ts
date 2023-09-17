import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {RefreshToken} from "./refreshToken.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true })
    userId: string;

    @Column({nullable: true})
    phone: string;

    @Column({nullable: true, select: false})
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({nullable: true})
    provider: string;

    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken[];
}