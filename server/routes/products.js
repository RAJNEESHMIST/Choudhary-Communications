import express from 'express';
import multer from 'multer';
import {
  listProducts,
  addProduct,
  editProduct,
  getProductImage,
  removeProduct
} from '../controllers/productsController.js';
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', async (req, res) => {
  try {
    await listProducts(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id/image', async (req, res) => {
  try {
    await getProductImage(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', upload.single('imageFile'), async (req, res) => {
  try {
    await addProduct(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', upload.single('imageFile'), async (req, res) => {
  try {
    await editProduct(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await removeProduct(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
