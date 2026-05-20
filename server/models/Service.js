import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String }
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', serviceSchema);
