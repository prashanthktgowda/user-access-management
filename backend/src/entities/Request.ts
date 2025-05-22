// backend/src/entities/Request.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Software } from './Software';

export type AccessType = 'Read' | 'Write' | 'Admin';
export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

@Entity()
export class Request {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.requests, { eager: false }) // eager: false is default, set true to always load
    user!: User;

    @ManyToOne(() => Software, (software) => software.requests, { eager: true }) // eager: true to load software details with request
    software!: Software;

    @Column({
        type: 'enum',
        enum: ['Read', 'Write', 'Admin'],
    })
    accessType!: AccessType;

    @Column('text')
    reason!: string;

    @Column({
        type: 'enum',
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    })
    status!: RequestStatus;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}