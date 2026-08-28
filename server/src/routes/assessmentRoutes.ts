import { Router } from 'express';
import {
  getCategoriesAndTopics,
  getQuestionsForTest,
  submitAssessment,
  getAttemptsHistory
} from '../controllers/assessmentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/meta', getCategoriesAndTopics);
router.get('/questions', getQuestionsForTest);
router.post('/submit', submitAssessment);
router.get('/history', getAttemptsHistory);

export default router;
