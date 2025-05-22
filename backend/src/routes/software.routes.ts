import { Router } from 'express';
import { createSoftware, getAllSoftware } from '../controllers/software.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

// POST /api/software - Admin only: Add new software
router.post(
    '/',
    authenticateJWT,
    authorizeRole(['Admin']),
    createSoftware
);

// GET /api/software - Authenticated users: List all software
router.get(
    '/',
    authenticateJWT,
    getAllSoftware
);

export default router;