// backend/src/types/express.d.ts
import { UserRole } from '../entities/User';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: UserRole;
                username: string;
            };
        }
    }
}
export {}; // Important to make this a module if you import UserRole