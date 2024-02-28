import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn, JoinTable, ManyToMany, DeleteDateColumn, OneToMany
} from 'typeorm';
import {User} from "./user.entity";
import {GroupUserAssociation} from "./groupUserAssociation.entity";
import {FavorUserAssociation} from "./favorUserAssociation.entity";
import {Group} from "./group.entity";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @Column()
    message: string;

    @Column()
    type: string;

    @Column({default: false})
    isRead: boolean;

    @Column()
    parameterId: number;

    @Column()
    parameterText: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}