import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, DeleteDateColumn} from 'typeorm';
import {RefreshToken} from "./refreshToken.entity";
import {Group} from "./group.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone: string;

    @Column({nullable: true})
    provider: string;

    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken[];

    @DeleteDateColumn()
    deletedAt: Date;
}