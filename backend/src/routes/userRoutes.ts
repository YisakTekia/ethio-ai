import express from 'express';
import { getUserProfile, updateUserName } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/update-name', protect, updateUserName);

export default router;