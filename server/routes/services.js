import express from 'express';
import {
  listServices,
  addService,
  editService,
  removeService
} from '../controllers/servicesController.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await listServices(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    await addService(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await editService(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await removeService(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
