import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn, DeleteDateColumn
} from 'typeorm';
import {User} from "./user.entity";
import {Group} from "./group.entity";
import {Favor} from "./favor.entity";

@Entity()
export class FavorUserAssociation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Favor, favor => favor.id)
    @JoinColumn({ name: 'favorId' })
    favor: Favor;

    @Column()
    favorId: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @ManyToOne(() => Group, group => group.id)
    @JoinColumn({ name: 'groupId' })
    group: Group;

    @Column()
    groupId: number;

    @Column({ default: false })
    isComplete: boolean;

    @Column({ default: false })
    isCreator: boolean;

    @Column()
    nickName: string;

    @Column({ nullable: true })
    fileUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}