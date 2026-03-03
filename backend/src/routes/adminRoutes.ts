// src/routes/adminRoutes.ts
import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminController';
import { protect } from '../middlewares/authMiddleware';
import { adminOnly } from '../middlewares/adminMiddleware';

const router = Router();

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard analytics (Requires Token + Admin Role)
 * @access  Private/Admin
 */
router.get('/stats', protect, adminOnly, getDashboardStats);

export default router;