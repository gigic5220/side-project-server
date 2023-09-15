import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import {User} from "./user.entity";

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    refreshToken: string;

    @ManyToOne(() => User, user => user.refreshTokens)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;
}