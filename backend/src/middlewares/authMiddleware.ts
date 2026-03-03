// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend the Express Request interface to include the authenticated user
export interface AuthRequest extends Request {
  user?: IUser;
}

// Interface for the decoded JWT payload
interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

/**
 * Enterprise-grade authentication middleware.
 * Intercepts requests, verifies the JWT token, and attaches the user to the request object.
 */
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // 1. Check if the Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token from the header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      if (!process.env.JWT_SECRET) {
        throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
      }

      // 3. Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

      // 4. Find the user in the database using the decoded ID
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(401).json({ 
          status: 'error', 
          message: 'Not authorized. User no longer exists in the system.' 
        });
        return;
      }

      // 5. Attach the authenticated user document to the request object
      req.user = user;
      
      // 6. Proceed to the next middleware or the actual controller
      next();

    } catch (error) {
      console.error('[AUTH MIDDLEWARE ERROR]: Invalid or expired token.', error);
      res.status(401).json({ 
        status: 'error', 
        message: 'Not authorized. Token failed or expired.' 
      });
    }
  } else {
    // 7. If no token is provided at all
    res.status(401).json({ 
      status: 'error', 
      message: 'Not authorized. No token provided.' 
    });
  }
};