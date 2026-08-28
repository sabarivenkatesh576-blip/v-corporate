import { Router } from 'express';
import { uploadAndAnalyzeResume, getResume } from '../controllers/resumeController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.use(authMiddleware);
router.post('/upload', upload.single('resume'), uploadAndAnalyzeResume);
router.get('/', getResume);

export default router;
