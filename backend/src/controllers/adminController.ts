// src/controllers/adminController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import QuizAttempt from '../models/quizAttempt';

/**
 * Fetches core business statistics for the Admin Dashboard.
 */
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Get total number of registered users
    const totalUsers = await User.countDocuments();
    
    // 2. Get total number of paying/VIP users
    const paidUsers = await User.countDocuments({ isPaid: true });
    
    // 3. Get total number of quiz attempts (engagement metric)
    const totalQuizAttempts = await QuizAttempt.countDocuments();

    // 4. Calculate Estimated Daily Revenue (Assuming 2 Birr per paid user)
    const estimatedDailyRevenue = paidUsers * 2;

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        paidUsers,
        totalQuizAttempts,
        estimatedDailyRevenue
      }
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER ERROR]:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while fetching dashboard statistics.' 
    });
  }
};