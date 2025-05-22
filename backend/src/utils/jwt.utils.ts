import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'LwW2rn7F4uJyICzwRywTIRltfM1T6l5FjlEEmjrOgeQ=';

export const generateToken = (payload: object, expiresIn: SignOptions['expiresIn'] = '1h'): string => {
    const options: SignOptions = {};
    if (expiresIn !== undefined) {
        options.expiresIn = expiresIn;
    }
    return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): any | null => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};