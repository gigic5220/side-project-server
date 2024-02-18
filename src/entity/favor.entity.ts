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
export class Favor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    detail: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'creatorId' })
    user: User;

    @ManyToOne(() => Group)
    @JoinColumn({ name: 'groupId' })
    group: Group;

    @Column()
    creatorId: number;

    @Column()
    groupId: number;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => FavorUserAssociation, favorUserAssociation => favorUserAssociation.favor)
    favorUserAssociations: FavorUserAssociation[];
}