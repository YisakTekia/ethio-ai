// src/routes/chatRoutes.ts
import { Router } from 'express';
import { handleChatMessage } from '../controllers/chatController';
// 🔴 ጊዜያዊ ማቋረጥ: የ protect ጠባቂውን አጥፍተነዋል (DB እንዳይጠይቅ)

const router = Router();

/**
 * @route   POST /api/chat
 * @desc    Receive user message, interact with Gemini AI, and return response
 * @access  Public for now (Mock mode - No DB)
 */
// 🔴 protect ጠፋ፣ ቀጥታ ወደ controller ያልፋል
router.post('/', handleChatMessage);

export default router;