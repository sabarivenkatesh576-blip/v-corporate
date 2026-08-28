import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getInternships, applyToInternship } from '../controllers/internshipController';

const router = Router();
router.get('/', authenticateToken, getInternships);
router.post('/:id/apply', authenticateToken, applyToInternship);

export default router;
