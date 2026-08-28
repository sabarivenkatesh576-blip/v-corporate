import { Router } from 'express';
import {
  getUserTeams,
  createTeam,
  joinTeamByCode,
  getTeamDetails,
  getTeamMessages,
  updateSharedWorkspace
} from '../controllers/teamController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getUserTeams);
router.post('/create', createTeam);
router.post('/join', joinTeamByCode);
router.get('/:id', getTeamDetails);
router.get('/:id/messages', getTeamMessages);
router.put('/:id/workspace', updateSharedWorkspace);

export default router;
