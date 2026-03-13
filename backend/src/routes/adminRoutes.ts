import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware';

import { getDashboardStats, createQuiz, createTip, getWinners } from '../controllers/adminController';

const router = express.Router();


router.get('/stats', protect, admin, getDashboardStats);
router.post('/quizzes', protect, admin, createQuiz);
router.post('/tips', protect, admin, createTip);
router.get('/winners', protect, admin, getWinners);

export default router;