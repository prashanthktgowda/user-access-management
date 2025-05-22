import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils'; // Ensure path is correct
import { UserRole } from '../entities/User';     // Ensure path is correct

// Define AuthenticatedRequest interface (if not already defined globally via a .d.ts file)
// If it IS defined globally, you can just use `Request` for the `req` parameter type.
export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        role: UserRole;
        username: string;
    };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => { // Explicit void return
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        // Ensure verifyToken's return type is compatible or cast it
        const userPayload = verifyToken(token) as { id: number; role: UserRole; username: string } | null;

        if (userPayload) {
            req.user = userPayload;
            next();
            return; // Explicitly return after calling next()
        }
    }
    // If token is missing, invalid, or payload is null
    res.status(401).json({ message: 'Unauthorized: Invalid or missing token' });
    return; // Explicitly return after sending response
};

export const authorizeRole = (allowedRoles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => { // Explicit void return
        if (!req.user || !req.user.role) {
            res.status(401).json({ message: 'Unauthorized: User role not found in token' });
            return; // Explicitly return after sending response
        }

        if (allowedRoles.includes(req.user.role)) {
            next();
            return; // Explicitly return after calling next()
        }

        res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
        return; // Explicitly return after sending response
    };
};