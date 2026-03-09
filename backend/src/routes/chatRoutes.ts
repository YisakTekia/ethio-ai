// src/routes/chatRoutes.ts
import { Router } from 'express';
import { handleChatMessage } from '../controllers/chatController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();


router.post('/', protect, handleChatMessage);

export default router;