import { Router } from 'express';
import {
  startInterviewSession,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getSessionById
} from '../controllers/interviewController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.post('/start', startInterviewSession);
router.post('/answer', submitAnswer);
router.post('/complete', completeInterview);
router.get('/history', getInterviewHistory);
router.get('/:id', getSessionById);

export default router;
