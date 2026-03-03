// src/models/QuizAttempt.ts
import mongoose, { Document, Schema } from 'mongoose';

// Interface defining the Quiz Attempt structure
export interface IQuizAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  dateStr: string; // Stored as 'YYYY-MM-DD' to group daily attempts
  isCorrect: boolean;
  answeredAt: Date;
} 

const QuizAttemptSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dateStr: {
      type: String,
      required: true,
      index: true, // Indexed to quickly query today's top 3 winners
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Ensure a user can only attempt the quiz once per day
QuizAttemptSchema.index({ userId: 1, dateStr: 1 }, { unique: true });

export default mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);