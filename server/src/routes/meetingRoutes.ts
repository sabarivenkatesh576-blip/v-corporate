import { Router } from 'express';
import {
  getMeetings,
  getMeetingById,
  scheduleMeeting,
  updateMeetingNotes,
  generateAIMeetingMinutes
} from '../controllers/meetingController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getMeetings);
router.post('/schedule', scheduleMeeting);
router.get('/:id', getMeetingById);
router.put('/:id/notes', updateMeetingNotes);
router.post('/:id/ai-minutes', generateAIMeetingMinutes);

export default router;
