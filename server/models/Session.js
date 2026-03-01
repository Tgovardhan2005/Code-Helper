import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  geminiResponse: { type: Object, required: true }
});

export default mongoose.model('Session', sessionSchema);
