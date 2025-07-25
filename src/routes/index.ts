import { Router } from 'express';
import authRoutes from './auth';
import operationRoutes from './operations';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Medical Logbook API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/operations', operationRoutes);

export default router;