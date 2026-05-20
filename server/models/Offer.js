import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Offer || mongoose.model('Offer', offerSchema);
