import { Router } from 'express';
import { getSkillGap, getLearningModules } from '../controllers/skillGapController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getSkillGap);
router.get('/modules', getLearningModules);

export default router;
