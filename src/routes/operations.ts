import { Router } from 'express';
import { OperationController } from '../controllers/OperationController';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { operationSchema, operationUpdateSchema, paginationSchema } from '../utils/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/operations
router.get('/', validate(paginationSchema), OperationController.getOperations);

// POST /api/operations
router.post('/', validate(operationSchema), OperationController.createOperation);

// GET /api/operations/stats
router.get('/stats', OperationController.getOperationStats);

// GET /api/operations/:id
router.get('/:id', OperationController.getOperation);

// PUT /api/operations/:id
router.put('/:id', validate(operationUpdateSchema), OperationController.updateOperation);

// DELETE /api/operations/:id
router.delete('/:id', OperationController.deleteOperation);

export default router;