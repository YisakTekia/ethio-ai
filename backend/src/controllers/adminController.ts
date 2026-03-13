// backend/src/controllers/adminController.ts
import User from '../models/User';
import DailyQuestion from '../models/dailyQuestion';
import Tip from '../models/tip';
import { AuthRequest } from '../middlewares/authMiddleware';

// 1. Fetch 100% real dynamic stats from the Database
export const getDashboardStats = async (req: AuthRequest, res: any) => {
  try {
    // A. Count total registered users in the database
    const totalUsers = await User.countDocuments();
    
    // B. Count paid/VIP users (Assuming users with points or specific roles are paid)
    // For now, let's count users who are not admins as regular customers
    const paidUsers = await User.countDocuments({ isAdmin: false }); 
    
    // C. Calculate exact quiz attempts for TODAY
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Count how many users have their 'lastQuizDate' set to today
    const totalQuizAttempts = await User.countDocuments({ 
      lastQuizDate: { $gte: today } 
    });

    // D. Calculate estimated revenue (e.g., 100 ETB per active user)
    const estimatedDailyRevenue = paidUsers * 100;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        paidUsers,
        totalQuizAttempts,
        estimatedDailyRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

// 2. Create a new Daily Quiz and disable the old ones
export const createQuiz = async (req: AuthRequest, res: any) => {
  try {
    const { question, options, correctIndex, prize1st, prize2nd, prize3rd } = req.body;
    
    // Deactivate all previous quizzes so only the new one is active
    await DailyQuestion.updateMany({}, { isActive: false }); 
    
    // Save the new quiz to the database with dynamic prizes
    const newQuiz = await DailyQuestion.create({ 
      question, 
      options, 
      correctIndex,
      prize1st,
      prize2nd,
      prize3rd
    });
    
    res.status(201).json({ success: true, data: newQuiz });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create quiz' });
  }
};

// 3. Create a new Daily Tip (Overwrites the old tip)
export const createTip = async (req: AuthRequest, res: any) => {
  try {
    const { title, content } = req.body;
    
    // Clear old tips so the Home page always fetches the single latest tip
    await Tip.deleteMany({}); 
    
    // Save the new tip to the database
    const newTip = await Tip.create({ title, content });
    
    res.status(201).json({ success: true, data: newTip });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create tip' });
  }
};

// 4. Fetch the Top 3 Winners based on fastest submission time
export const getWinners = async (req: AuthRequest, res: any) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find users who answered correctly today, sorted by earliest submission time
    const winners = await User.find({ 
      lastQuizCorrect: true,
      lastQuizDate: { $gte: today }
    })
    .sort({ lastQuizDate: 1 }) // Ascending order (Fastest first)
    .limit(3) // Top 3 winners only
    .select('phone lastQuizDate');

    // Fetch the currently active quiz to get the dynamic prize amounts
    const activeQuiz: any = await DailyQuestion.findOne({ isActive: true });

    res.status(200).json({ 
      success: true, 
      data: winners,
      prizes: {
        first: activeQuiz?.prize1st || 200,
        second: activeQuiz?.prize2nd || 100,
        third: activeQuiz?.prize3rd || 50
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch winners' });
  }
};