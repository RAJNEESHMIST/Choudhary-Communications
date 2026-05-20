import express from 'express';
import {
  readSettings,
  changeSettings
} from '../controllers/settingsController.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await readSettings(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    await changeSettings(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
