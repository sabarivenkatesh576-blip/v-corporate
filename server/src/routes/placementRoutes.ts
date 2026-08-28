import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getPlacementDrives, applyToPlacementDrive } from '../controllers/placementController';

const router = Router();
router.get('/', authenticateToken, getPlacementDrives);
router.post('/:id/apply', authenticateToken, applyToPlacementDrive);

export default router;
