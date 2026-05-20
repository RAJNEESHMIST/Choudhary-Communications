import express from 'express';
import { login } from '../controllers/authController.js';
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    login(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
