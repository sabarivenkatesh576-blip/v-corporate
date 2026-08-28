import { Router } from 'express';
import { getProfile, updateProfile, getReadinessScore } from '../controllers/profileController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/readiness', getReadinessScore);

export default router;
