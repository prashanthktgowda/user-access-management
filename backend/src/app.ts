// backend/src/app.ts
import express, { Application, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import softwareRoutes from './routes/software.routes';
import requestRoutes from './routes/request.routes';
// import { Request } from './entities/Request';
// import { Software } from './entities/Software';
// import { User } from './entities/User';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic Route
app.get('/', (req: ExpressRequest, res: ExpressResponse) => {
    res.send('User Access Management API is running!');
});

// API Routes (to be added)
app.use('/api/auth', authRoutes);
app.use('/api/software', softwareRoutes);
app.use('/api/requests', requestRoutes);


// Global Error Handler (Optional - basic example)
app.use((err: Error, req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!', error: err.message });
});

export default app;