import Offer from '../models/Offer.js';

const fallbackOffers = [
  {
    _id: 'o1',
    title: 'Festive Smartphone Sale',
    description: 'Up to 35% off on selected phones for a limited time.',
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3c5b36b7b48c?auto=format&fit=crop&w=900&q=70',
    startDate: '2026-05-10',
    endDate: '2026-07-01',
    active: true
  }
];
let offers = [...fallbackOffers];
const useFallback = !process.env.MONGODB_URI;

export async function getAllOffers() {
  if (useFallback) return [...offers];
  return Offer.find().sort({ startDate: -1 });
}

export async function createOffer(payload) {
  if (useFallback) {
    const active = new Date(payload.endDate) >= new Date();
    const offer = { ...payload, _id: `o${Date.now()}`, active };
    offers.unshift(offer);
    return offer;
  }
  return Offer.create(payload);
}

export async function updateOffer(id, payload) {
  if (useFallback) {
    offers = offers.map((item) => (item._id === id ? { ...item, ...payload } : item));
    return offers.find((item) => item._id === id);
  }
  return Offer.findByIdAndUpdate(id, payload, { new: true });
}

export async function deleteOffer(id) {
  if (useFallback) {
    offers = offers.filter((item) => item._id !== id);
    return { success: true };
  }
  await Offer.findByIdAndDelete(id);
  return { success: true };
}
