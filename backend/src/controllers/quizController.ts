// src/controllers/quizController.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import QuizAttempt from '../models/quizAttempt';
import User from '../models/User';

/**
 * Handles daily quiz submissions, enforces 1-attempt-per-day limit, 
 * and calculates rewards based on response speed (Top 3 winners).
 * Rewards: 1st = 200, 2nd = 100, 3rd = 50 points/Birr.
 */
export const submitQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { isCorrect } = req.body; // Frontend sends boolean: true or false

    if (!userId) {
      res.status(401).json({ status: 'error', message: 'User not authenticated.' });
      return;
    }

    // 1. Get today's date formatted as YYYY-MM-DD
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    // 2. Check if user already attempted the quiz today
    const existingAttempt = await QuizAttempt.findOne({ userId, dateStr });
    if (existingAttempt) {
      res.status(400).json({ 
        status: 'error', 
        message: 'You have already attempted the quiz today. Please come back tomorrow!' 
      });
      return;
    }

    // 3. Record the new attempt with the exact timestamp
    const attempt = await QuizAttempt.create({
      userId,
      dateStr,
      isCorrect
    });

    let rewardPoints = 0;
    let rank = 0;

    // 4. Calculate rewards ONLY if the answer is correct
    if (isCorrect) {
      // Find how many users answered correctly today BEFORE this exact attempt
      const previousCorrectCount = await QuizAttempt.countDocuments({
        dateStr,
        isCorrect: true,
        _id: { $ne: attempt._id },
        answeredAt: { $lt: attempt.answeredAt }
      });

      // Determine rank (previous winners + 1)
      rank = previousCorrectCount + 1;

      // Assign rewards based on rank
      if (rank === 1) rewardPoints = 200;
      else if (rank === 2) rewardPoints = 100;
      else if (rank === 3) rewardPoints = 50;
      else rewardPoints = 0; // Late correct answer, no monetary reward

      // 5. Update the user's points securely in the database
      if (rewardPoints > 0) {
        await User.findByIdAndUpdate(userId, {
          $inc: { points: rewardPoints } // $inc safely adds points without race conditions
        });
      }
    }

    // 6. Send the result back to the frontend
    res.status(200).json({
      status: 'success',
      isCorrect,
      rank: isCorrect ? rank : null,
      rewardPoints,
      message: rewardPoints > 0 
        ? `Congratulations! You ranked #${rank} and won ${rewardPoints} Birr!` 
        : isCorrect 
          ? `Correct answer, but you were rank #${rank}. Top 3 already won today's prizes.` 
          : `Incorrect answer. Try again tomorrow!`
    });

  } catch (error) {
    console.error('[QUIZ CONTROLLER ERROR]:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'An internal server error occurred while processing the quiz.' 
    });
  }
};