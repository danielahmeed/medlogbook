import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { loginSchema, registerSchema } from '../utils/validation';

const router = Router();

// POST /api/auth/login
router.post('/login', validate(loginSchema), AuthController.login);

// POST /api/auth/register
router.post('/register', validate(registerSchema), AuthController.register);

// GET /api/auth/me
router.get('/me', authenticate, AuthController.getCurrentUser);

export default router;