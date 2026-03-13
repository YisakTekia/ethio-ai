import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  phone: string;
  password: string;
  status: string; // 'active', 'unsubscribed', 'inactive'
  product_id?: string;
  role: string;
  isAdmin: boolean;
  lastQuizDate: Date | null;
  lastQuizTimeTaken: number;
  lastQuizCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema({
  name: { type: String, default: '' },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: 'active' }, 
  product_id: { type: String }, 
  role: { type: String, default: 'user' },
  isAdmin: { type: Boolean, default: false },
  lastQuizDate: { type: Date, default: null },
  lastQuizTimeTaken: { type: Number, default: 0 },
  lastQuizCorrect: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);