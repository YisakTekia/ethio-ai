// src/routes/chatRoutes.ts
import { Router } from 'express';
import { handleChatMessage } from '../controllers/chatController';
import { protect } from '../middlewares/authMiddleware'; // <-- Import the protector

const router = Router();

/**
 * @route   POST /api/chat
 * @desc    Receive user message, interact with Gemini AI, and return response
 * @access  Private (Requires valid JWT Token)
 */
// Insert 'protect' before 'handleChatMessage'
router.post('/', protect, handleChatMessage);

export default router;