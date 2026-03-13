import express from 'express';
import { getDailyQuiz, submitQuiz,getDailyTip } from '../controllers/quizController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/daily', protect, getDailyQuiz);
router.post('/submit', protect, submitQuiz);
router.get('/tip', protect, getDailyTip);
export default router;