import Service from '../models/Service.js';

const fallbackServices = [
  {
    _id: 's1',
    title: 'Screen Replacement',
    description: 'Fast, reliable screen replacement for phones.',
    icon: '🔧'
  },
  {
    _id: 's2',
    title: 'Recharge',
    description: 'Instant prepaid and postpaid recharge support.',
    icon: '⚡'
  }
];
let services = [...fallbackServices];
const useFallback = !process.env.MONGODB_URI;

export async function getAllServices() {
  if (useFallback) return [...services];
  return Service.find().sort({ createdAt: -1 });
}

export async function createService(payload) {
  if (useFallback) {
    const service = { ...payload, _id: `s${Date.now()}` };
    services.unshift(service);
    return service;
  }
  return Service.create(payload);
}

export async function updateService(id, payload) {
  if (useFallback) {
    services = services.map((item) => (item._id === id ? { ...item, ...payload } : item));
    return services.find((item) => item._id === id);
  }
  return Service.findByIdAndUpdate(id, payload, { new: true });
}

export async function deleteService(id) {
  if (useFallback) {
    services = services.filter((item) => item._id !== id);
    return { success: true };
  }
  await Service.findByIdAndDelete(id);
  return { success: true };
}
