// src/routes/quizRoutes.ts
import { Router } from 'express';
import { submitQuiz } from '../controllers/quizController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route   POST /api/quiz/submit
 * @desc    Submit daily quiz answer and calculate top 3 rewards
 * @access  Private (Requires valid JWT Token)
 */
router.post('/submit', protect, submitQuiz);

export default router;