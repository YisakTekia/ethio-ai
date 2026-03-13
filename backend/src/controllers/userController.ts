import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getUserProfile = async (req: AuthRequest, res: Response | any) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const updateUserName = async (req: AuthRequest, res: Response | any) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { name }, 
      { new: true }
    ).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating name' });
  }
};