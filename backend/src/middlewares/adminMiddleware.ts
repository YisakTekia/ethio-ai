// src/middlewares/adminMiddleware.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

/**
 * Enterprise middleware to strictly protect admin routes.
 * Ensures the user making the request has the 'admin' role.
 */
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Check if user exists and has the 'admin' role
  if (req.user && req.user.role === 'admin') {
    next(); // Pass to the actual controller
  } else {
    res.status(403).json({ 
      status: 'error', 
      message: 'Access Denied. You are not authorized to view this page.' 
    });
  }
};