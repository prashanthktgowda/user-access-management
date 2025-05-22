// backend/src/config/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';
import { Software } from '../entities/Software';
import { Request } from '../entities/Request';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433'),
    username: process.env.DB_USERNAME || 'myuser',
    password: process.env.DB_PASSWORD || 'mypassword',
    database: process.env.DB_DATABASE || 'mydb',
    synchronize: true, // true for dev (auto-creates schema), false for prod (use migrations)
    logging: false, // Set to true to see SQL queries
    entities: [User, Software, Request], // Add your entities here
    migrations: [], // Add migration paths if you use them
    subscribers: [],
});