// backend/src/controllers/software.controller.ts
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { AppDataSource } from '../config/data-source';
import { Software } from '../entities/Software';

const softwareRepository = AppDataSource.getRepository(Software);

// POST /api/software - Admin only
// POST /api/software - Admin only
export const createSoftware = async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    const { name, description, accessLevels } = req.body;

    if (!name || !description || !accessLevels || !Array.isArray(accessLevels)) {
        res.status(400).json({ message: 'Name, description, and accessLevels (array) are required' });
        return;
    }

    try {
        const newSoftware = softwareRepository.create({ name, description, accessLevels });
        await softwareRepository.save(newSoftware);
        res.status(201).json({ message: 'Software created successfully', software: newSoftware });
    } catch (error) {
        console.error("Create software error:", error);
        res.status(500).json({ message: 'Error creating software', error: (error as Error).message });
    }
};
// GET /api/software - Authenticated users
export const getAllSoftware = async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    try {
        const allSoftware = await softwareRepository.find();
        res.status(200).json(allSoftware); // <-- Do NOT return this line
    } catch (error) {
        console.error("Get all software error:", error);
        res.status(500).json({ message: 'Error fetching software', error: (error as Error).message });
    }
};