import { Response } from 'express';
import DailyQuestion from '../models/dailyQuestion';
import User from '../models/User';
import { AuthRequest } from '../middlewares/authMiddleware';
import Tip from '../models/tip';

export const getDailyQuiz = async (req: AuthRequest, res: Response | any) => {
  try {
    const quiz = await DailyQuestion.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!quiz) {
      return res.status(404).json({ message: 'No active quiz found' });
    }
    
    res.status(200).json({
      success: true,
      data: {
        _id: quiz._id,
        question: quiz.question,
        options: quiz.options
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz' });
  }
};


export const submitQuiz = async (req: AuthRequest, res: Response | any) => {
  try {
    const { quizId, selectedIndex } = req.body; 
    
    const user: any = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date().setHours(0, 0, 0, 0);
    if (user.lastQuizDate && new Date(user.lastQuizDate).setHours(0, 0, 0, 0) === today) {
      return res.status(403).json({ success: false, message: 'ለዛሬ የሚፈቀድልዎትን አንድ ሙከራ ተጠቅመዋል።' });
    }

    const quiz: any = await DailyQuestion.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const isCorrect = quiz.correctIndex === selectedIndex;

    await User.findByIdAndUpdate(req.user._id, {
      $set: { 
        lastQuizDate: new Date(), 
        lastQuizCorrect: isCorrect
      } 
    });

    res.status(200).json({
      success: true,
      isCorrect,
      message: isCorrect ? 'Correct answer!' : 'Wrong answer'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz' });
  }
  
};
export const getDailyTip = async (req: any, res: any) => {
  try {
    const tip = await Tip.findOne().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tip });
  } catch (error) {
    res.status(500).json({ message: 'ምክር ማምጣት አልተቻለም' });
  }
};