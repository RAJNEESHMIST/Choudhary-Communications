import express from 'express';
import {
  listOffers,
  addOffer,
  editOffer,
  removeOffer
} from '../controllers/offersController.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await listOffers(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    await addOffer(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await editOffer(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await removeOffer(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
