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
export class GroupJoinRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @Column()
    nickName: string;

    @Column({ nullable: true })
    fileUrl: string;

    @ManyToOne(() => Group)
    @JoinColumn({ name: 'groupId' })
    group: Group;

    @Column()
    groupId: number;

    @Column({default: false})
    isAccepted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => GroupUserAssociation, groupUserAssociation => groupUserAssociation.group)
    groupUserAssociations: GroupUserAssociation[];
}