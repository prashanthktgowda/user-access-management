// backend/src/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Request } from './Request'; // We'll need this for the relation

export type UserRole = 'Employee' | 'Manager' | 'Admin';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @Column({
        type: 'enum',
        enum: ['Employee', 'Manager', 'Admin'],
        default: 'Employee',
    })
    role!: UserRole;

    // Relation: A user can make many requests
    @OneToMany(() => Request, (request) => request.user)
    requests!: Request[];
}