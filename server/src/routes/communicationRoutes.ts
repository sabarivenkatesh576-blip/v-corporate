import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getCommunicationScenarios, analyzeCommunication } from '../controllers/communicationController';

const router = Router();
router.get('/scenarios', authenticateToken, getCommunicationScenarios);
router.post('/analyze', authenticateToken, analyzeCommunication);

export default router;
