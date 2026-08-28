import { Router } from 'express';
import { chatAssistant } from '../controllers/aiAssistantController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.post('/chat', chatAssistant);

export default router;
