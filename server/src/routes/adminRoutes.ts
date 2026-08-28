import { Router } from 'express';
import {
  getCohortStats,
  getStudentsList,
  createProject,
  createQuestion
} from '../controllers/adminController';
import { authMiddleware, adminOnlyMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.use(adminOnlyMiddleware);

router.get('/stats', getCohortStats);
router.get('/students', getStudentsList);
router.post('/projects', createProject);
router.post('/questions', createQuestion);

export default router;
