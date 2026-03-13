import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response | any, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      return res.status(401).json({ message: 'AUTH_EXPIRED' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'AUTH_MISSING' });
  }
};

export const admin = (req: AuthRequest, res: Response | any, next: NextFunction) => {

  if (req.user && (req.user.isAdmin || req.user.role === 'admin')) {
    next();
  } else {
    
    return res.status(403).json({ message: 'ACCESS_DENIED' });
  }
};