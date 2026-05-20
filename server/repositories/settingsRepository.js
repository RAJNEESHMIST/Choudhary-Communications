import Setting from '../models/Setting.js';

const fallbackSettings = {
  whatsapp: 'https://wa.me/917891753753',
  phone: '+91 78917 53753',
  address: 'Near City Center, Main Road, Jaipur',
  mapLink: 'https://www.google.com/maps',
  timings: '10:00 AM - 9:00 PM, Mon-Sat'
};
let settings = { ...fallbackSettings };
const useFallback = !process.env.MONGODB_URI;

export async function getSettings() {
  if (useFallback) return { ...settings };
  const dbSettings = await Setting.findOne().sort({ createdAt: -1 });
  return dbSettings || fallbackSettings;
}

export async function updateSettings(payload) {
  if (useFallback) {
    settings = { ...settings, ...payload };
    return { ...settings };
  }
  const updated = await Setting.findOneAndUpdate({}, payload, { upsert: true, new: true });
  return updated;
}
