// src/config/db.ts
import mongoose from 'mongoose';

/**
 * Establishes a secure connection to the MongoDB database.
 * Implements enterprise-grade error handling and stops the server if DB fails.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in the environment variables.');
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${(error as Error).message}`);
    // Exit process with failure code to prevent the app from running blindly
    process.exit(1);
  }
};