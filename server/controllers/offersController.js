import {
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer
} from '../repositories/offersRepository.js';

function evaluateActive(offer) {
  if (!offer || !offer.endDate) return offer;
  const active = new Date(offer.endDate) >= new Date();
  return { ...offer.toObject?.(), ...offer, active };
}

export async function listOffers(req, res) {
  const offers = await getAllOffers();
  const activeOffers = offers.map((offer) => evaluateActive(offer));
  res.json(activeOffers);
}

export async function addOffer(req, res) {
  const offer = await createOffer(req.body);
  res.status(201).json(offer);
}

export async function editOffer(req, res) {
  const offer = await updateOffer(req.params.id, req.body);
  res.json(offer);
}

export async function removeOffer(req, res) {
  const result = await deleteOffer(req.params.id);
  res.json(result);
}
