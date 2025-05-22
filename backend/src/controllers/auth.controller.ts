import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User'; // UserRole is not directly used here, but User entity is
import { generateToken } from '../utils/jwt.utils';

import { Software } from '../entities/Software';

const userRepository = AppDataSource.getRepository(User);

export const signup = async (req: ExpressRequest, res: ExpressResponse): Promise<void> => { // Explicit return type
    const { username, password, role } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return; // Added return
    }

    try {
        const existingUser = await userRepository.findOneBy({ username });
        if (existingUser) {
            res.status(400).json({ message: 'Username already exists' });
            return; // Added return
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({
            username,
            password: hashedPassword,
            role: role || 'Employee',
        });

        await userRepository.save(newUser);
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ message: 'User created successfully', user: userWithoutPassword });
        return; // Added return

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: 'Error creating user', error: (error as Error).message });
        return; // Added return
    }
};

export const login = async (req: ExpressRequest, res: ExpressResponse): Promise<void> => { // Explicit return type
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return; // Added return
    }

    try {
        const user = await userRepository.findOneBy({ username });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials (user not found)' }); // More specific message
            return; // Added return
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials (password mismatch)' }); // More specific message
            return; // Added return
        }

        const token = generateToken({ id: user.id, role: user.role, username: user.username });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        });
        return; // Added return
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
        return; // Added return
    }
};
const softwareRepository = AppDataSource.getRepository(Software);
// GET /api/software - Authenticated users
export const getAllSoftware = async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    try {
        const allSoftware = await softwareRepository.find();
        res.status(200).json(allSoftware);
    } catch (error) {
        console.error("Get all software error:", error);
        res.status(500).json({ message: 'Error fetching software', error: (error as Error).message });
    }
};