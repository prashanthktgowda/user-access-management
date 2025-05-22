// backend/src/entities/Software.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Request } from './Request'; // For relation

@Entity()
export class Software {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column('text')
    description!: string;

    @Column('simple-array') // Stores array as comma-separated string
    accessLevels!: string[]; // e.g., ["Read", "Write", "Admin"]

    // Relation: A software can be part of many requests
    @OneToMany(() => Request, (request) => request.software)
    requests!: Request[];
}