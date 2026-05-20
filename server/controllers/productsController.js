import sharp from 'sharp';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  resolveImageData
} from '../repositories/productsRepository.js';

/**
 * List all products
 */
export async function listProducts(req, res) {
  try {
    const products = await getAllProducts();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error listing products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
}

/**
 * Add a new product
 */
export async function addProduct(req, res) {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.price || !req.body.brand) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, price, brand'
      });
    }

    // Validate price is a positive number
    const price = Number(req.body.price);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number'
      });
    }

    // Validate that we have an image
    if (!req.file && !req.body.imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Product image is required (upload file or provide URL)'
      });
    }

    const imageData = await resolveImageData(req.file, req.body.imageUrl);
    
    const productPayload = {
      name: req.body.name.trim(),
      price: price,
      brand: req.body.brand.trim(),
      category: req.body.category || 'Accessories',
      shortDescription: (req.body.shortDescription || '').trim(),
      availability: req.body.availability || 'In Stock',
      featured: req.body.featured === 'true' || req.body.featured === true
    };

    // If URL was provided and image data couldn't be resolved, store the URL
    if (!imageData && req.body.imageUrl) {
      productPayload.imageUrl = req.body.imageUrl;
    }

    const product = await createProduct(productPayload, imageData);
    
    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: product
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product',
      error: error.message
    });
  }
}

/**
 * Edit a product
 */
export async function editProduct(req, res) {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const existingProduct = await getProductById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Validate price if provided
    if (req.body.price) {
      const price = Number(req.body.price);
      if (isNaN(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid positive number'
        });
      }
    }

    const imageData = await resolveImageData(req.file, req.body.imageUrl);

    const productPayload = {
      name: req.body.name?.trim() || existingProduct.name,
      price: req.body.price ? Number(req.body.price) : existingProduct.price,
      brand: req.body.brand?.trim() || existingProduct.brand,
      category: req.body.category || existingProduct.category,
      shortDescription: (req.body.shortDescription || '').trim(),
      availability: req.body.availability || existingProduct.availability,
      featured: req.body.featured === 'true' || req.body.featured === true
    };

    const product = await updateProduct(req.params.id, productPayload, imageData);
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
}

/**
 * Get product image
 */
export async function getProductImage(req, res) {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = await getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.image?.data) {
      return res.status(404).json({
        success: false,
        message: 'Image not found for this product'
      });
    }

    // Support optional size parameter for thumbnails
    const size = req.query.size || null;
    try {
      if (size === 'thumb') {
        const thumbBuffer = await sharp(product.image.data)
          .rotate()
          .resize(300, 300, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toBuffer();
        res.contentType('image/jpeg');
        return res.send(thumbBuffer);
      }

      // Default: respect orientation and serve optimized full image
      const fullBuffer = await sharp(product.image.data)
        .rotate()
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      res.contentType(product.image.contentType || 'image/jpeg');
      res.send(fullBuffer);
    } catch (err) {
      console.error('Error processing image for size:', err);
      // Fallback to original binary if processing fails
      res.contentType(product.image.contentType || 'image/jpeg');
      res.send(product.image.data);
    }
  } catch (error) {
    console.error('Error fetching product image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product image',
      error: error.message
    });
  }
}

/**
 * Remove a product
 */
export async function removeProduct(req, res) {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const result = await deleteProduct(req.params.id);
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: result
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
}
