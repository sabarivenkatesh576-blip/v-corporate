import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getGamificationOverview, getLeaderboard } from '../controllers/gamificationController';

const router = Router();
router.get('/overview', authenticateToken, getGamificationOverview);
router.get('/leaderboard', authenticateToken, getLeaderboard);

export default router;
