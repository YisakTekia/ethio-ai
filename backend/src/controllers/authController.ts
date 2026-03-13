import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT Token (Valid for 30 days)
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// 1. SUBSCRIBE (New Registration)
export const subscribe = async (req: Request, res: Response | any) => {
  try {
    // Expected format from the main subscription system: { phone, password, product_id, date }
    const { phone, password, product_id, date } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    let user = await User.findOne({ phone });

    // Encrypt (Hash) the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (user) {
      // If user previously existed, reactivate their account
      user.status = 'active';
      user.product_id = product_id;
      user.password = hashedPassword;
      await user.save();
    } else {
      // Create a brand new user
      user = await User.create({
        phone,
        password: hashedPassword,
        product_id,
        status: 'active'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscribed successfully',
      // FIX: Used .toString() instead of 'as string' to safely convert ObjectId
      token: generateToken(user._id.toString()),
      user: { phone: user.phone, status: user.status }
    });
  } catch (error) {
    res.status(500).json({ message: 'Subscription failed', error });
  }
};

// 2. UNSUBSCRIBE (Cancel Subscription)
export const unsubscribe = async (req: Request, res: Response | any) => {
  try {
    // Expected format: { pnumber, product_id, date }
    const { pnumber, product_id, date } = req.body;

    // Find the user by phone and change status to 'unsubscribed'
    const user = await User.findOneAndUpdate(
      { phone: pnumber }, 
      { status: 'unsubscribed' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unsubscribe failed' });
  }
};

// 3. RENEWAL (Renew Subscription)
export const renewal = async (req: Request, res: Response | any) => {
  try {
    // Expected format: { phone_number, date }
    const { phone_number, date } = req.body;

    // Find the user by phone and reactivate their status
    const user = await User.findOneAndUpdate(
      { phone: phone_number }, 
      { status: 'active' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Renewed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Renewal failed' });
  }
};

// 4. LOGIN (Frontend React App Login)
export const login = async (req: Request, res: Response | any) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    // Check if user exists and password matches the hashed password in the database
    if (user && (await bcrypt.compare(password, user.password))) {
      
      // Prevent access if the user is not active and not an admin
      if (user.status !== 'active' && !user.isAdmin) {
         return res.status(403).json({ message: 'እባክዎ መጀመሪያ ይመዝገቡ (Subscription Required)' });
      }

      res.status(200).json({
        success: true,
        // FIX: Used .toString() instead of 'as string'
        token: generateToken(user._id.toString()),
        user: { phone: user.phone, role: user.role, isAdmin: user.isAdmin, status: user.status }
      });
    } else {
      res.status(401).json({ message: 'የገቡት ኮድ ትክክል አይደለም (Invalid phone or OTP)' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};

// 5. CHECK PHONE (Verify if user is subscribed before sending OTP)
export const checkPhone = async (req: Request, res: Response | any) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    // If user does not exist or is not active (and not an admin)
    if (!user || (user.status !== 'active' && !user.isAdmin)) {
      return res.status(404).json({ 
        success: false, 
        message: 'እባክዎ መጀመሪያ ይመዝገቡ (Please subscribe first to access the service).' 
      });
    }

    // Tell the frontend that the user is valid and can proceed to enter OTP
    res.status(200).json({ 
      success: true, 
      message: 'User verified. Ready for OTP.' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking phone number' });
  }
};