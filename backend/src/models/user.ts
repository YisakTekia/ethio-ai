// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  password?: string; // Added password field for authentication
  isPaid: boolean;
  subscriptionExpiry?: Date;
  points: number;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      // It's required for new users, but we keep it flexible for schema migration
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    subscriptionExpiry: {
      type: Date,
    },
    points: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);