// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signup); // POST /api/auth/signup
router.post('/login', login);   // POST /api/auth/login

export default router;