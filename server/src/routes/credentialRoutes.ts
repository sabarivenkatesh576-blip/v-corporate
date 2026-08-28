import { Router } from 'express';
import { getUserCredentials, verifyCredentialPublic } from '../controllers/credentialController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public verification route
router.get('/verify/:id', verifyCredentialPublic);

// Authenticated user credentials
router.get('/', authMiddleware, getUserCredentials);

export default router;
