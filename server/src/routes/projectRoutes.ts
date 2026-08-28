import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  submitTaskDeliverable
} from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/submit-task', upload.single('deliverableFile'), submitTaskDeliverable);

export default router;
