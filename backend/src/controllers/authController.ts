// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

// Helper function to validate and format Ethiopian phone numbers
const formatEthioPhone = (phone: string): string | null => {
  const ethioPhoneRegex = /^(0|\+251)[79]\d{8}$/;
  if (!ethioPhoneRegex.test(phone)) return null;
  return phone.startsWith('+251') ? '0' + phone.slice(4) : phone;
};

/**
 * Step 1: Check if the user exists based on their phone number.
 */
export const checkUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;
    const formattedPhone = formatEthioPhone(phone);

    if (!formattedPhone) {
      res.status(400).json({ status: 'error', message: 'Invalid Ethiopian phone number.' });
      return;
    }

    const user = await User.findOne({ phone: formattedPhone });
    
    // Return whether the user exists or not
    res.status(200).json({
      status: 'success',
      exists: !!user,
      formattedPhone
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error during user check.' });
  }
};

/**
 * Step 2: Register a NEW user with a hashed password.
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;
    const formattedPhone = formatEthioPhone(phone);

    if (!formattedPhone || !password) {
      res.status(400).json({ status: 'error', message: 'Valid phone and password are required.' });
      return;
    }

    const existingUser = await User.findOne({ phone: formattedPhone });
    if (existingUser) {
      res.status(400).json({ status: 'error', message: 'User already exists. Please login.' });
      return;
    }

    // Securely hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      phone: formattedPhone,
      password: hashedPassword
    });

    const token = generateToken(user._id as string);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      token,
      data: { id: user._id, phone: user.phone, isPaid: user.isPaid, points: user.points }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error during registration.' });
  }
};

/**
 * Step 3: Login an EXISTING user by verifying their password.
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;
    const formattedPhone = formatEthioPhone(phone);

    if (!formattedPhone || !password) {
      res.status(400).json({ status: 'error', message: 'Phone and password are required.' });
      return;
    }

    const user = await User.findOne({ phone: formattedPhone });
    if (!user || !user.password) {
      res.status(401).json({ status: 'error', message: 'Invalid phone number or password.' });
      return;
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ status: 'error', message: 'Invalid phone number or password.' });
      return;
    }

    const token = generateToken(user._id as string);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      data: { id: user._id, phone: user.phone, isPaid: user.isPaid, points: user.points }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error during login.' });
  }
};