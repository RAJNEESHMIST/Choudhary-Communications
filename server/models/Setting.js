import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  whatsapp: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  mapLink: { type: String, default: '' },
  timings: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model('Setting', settingSchema);
