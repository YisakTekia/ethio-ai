// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

/**
 * Generates a highly secure JSON Web Token (JWT) for user authentication.
 * @param userId - The unique MongoDB Object ID of the user
 * @returns string - The signed JWT token
 */
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined in the environment variables.');
  }

  // Token expires in 30 days. This keeps the user logged in seamlessly.
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '30d', 
  });
};