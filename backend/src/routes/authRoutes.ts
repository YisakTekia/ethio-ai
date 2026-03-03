// src/routes/authRoutes.ts
import { Router } from 'express';
import { checkUser, registerUser, loginUser } from '../controllers/authController';

const router = Router();

// Check if a phone number is already registered
router.post('/check', checkUser);

// Register a new user
router.post('/register', registerUser);

// Login an existing user
router.post('/login', loginUser);

export default router;