// src/models/Chat.ts
import mongoose, { Document, Schema } from 'mongoose';

// Interface for individual messages
export interface IMessage {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Interface defining the Chat document structure
export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  domain: 'sports_entertainment' | 'health' | 'education';
  messages: IMessage[];
}

const ChatSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    domain: {
      type: String,
      enum: ['sports_entertainment', 'health', 'education'],
      required: true,
    },
    messages: [
      {
        text: { type: String, required: true },
        isBot: { type: Boolean, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexing for faster queries based on user and domain
ChatSchema.index({ userId: 1, domain: 1 });

export default mongoose.model<IChat>('Chat', ChatSchema);