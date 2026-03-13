// src/routes/chatRoutes.ts
import { Router } from 'express';
import { handleChatMessage, getChatHistory } from '../controllers/chatController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// Route to fetch previous chat history (Must be placed before the POST route)
// Expects: GET /api/chat/history?domain=sports_entertainment
router.get('/history', protect, getChatHistory);

// Route to send a new chat message
// Expects: POST /api/chat
router.post('/', protect, handleChatMessage);

export default router;