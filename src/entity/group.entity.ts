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

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    code: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => GroupUserAssociation, groupUserAssociation => groupUserAssociation.group)
    groupUserAssociations: GroupUserAssociation[];
}