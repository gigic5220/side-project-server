import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import {User} from "./user.entity";
import {Group} from "./group.entity";

@Entity()
export class GroupUserAssociation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    groupId: number;

    @Column()
    userId: number;

    @Column()
    nickName: string;

    @Column({ nullable: true })
    fileUrl: string;

    @ManyToOne(() => Group, group => group.id)
    @JoinColumn({ name: 'groupId' })
    group: Group;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}