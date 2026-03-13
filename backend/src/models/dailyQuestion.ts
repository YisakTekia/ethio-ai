import mongoose from 'mongoose';

const dailyQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  prize1st: { type: Number, default: 200 },
  prize2nd: { type: Number, default: 100 },
  prize3rd: { type: Number, default: 50 },
}, { timestamps: true });

export default mongoose.model('DailyQuestion', dailyQuestionSchema);