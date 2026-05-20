import Product from '../models/Product.js';
import sharp from 'sharp';
import { uploadToCloudinary } from '../config/cloudinary.js';

const fallbackProducts = [
  {
    _id: 'p1',
    name: 'Samsung Galaxy M14',
    price: 12499,
    brand: 'Samsung',
    category: 'Smartphones',
    shortDescription: 'Long-lasting battery with fast charging.',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=70',
    availability: 'In Stock',
    featured: true
  },
  {
    _id: 'p2',
    name: 'Realme Earbuds 3',
    price: 1799,
    brand: 'Realme',
    category: 'Earbuds',
    shortDescription: 'Crystal clear sound and lightweight fit.',
    imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155221c2f3?auto=format&fit=crop&w=900&q=70',
    availability: 'In Stock',
    featured: true
  }
];

let products = [...fallbackProducts];
const useFallback = !process.env.MONGODB_URI;

/**
 * Compresses image buffer using Sharp
 */
async function compressImage(buffer) {
  try {
    return await sharp(buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toBuffer();
  } catch (error) {
    console.error('Image compression error:', error);
    return buffer;
  }
}

/**
 * Validates image URL format and accessibility
 */
async function validateImageUrl(url) {
  if (!url) return false;

  try {
    new URL(url);

    // Try to fetch image headers to validate accessibility
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const contentType = response.headers.get('content-type') || '';
    return response.ok && contentType.startsWith('image/');
  } catch (error) {
    console.warn(`Image validation failed for ${url}:`, error.message);
    return false;
  }
}

/**
 * Normalizes remote image URLs (Google Drive, Dropbox, etc.)
 */
function normalizeRemoteImageUrl(imageUrl) {
  if (!imageUrl) return imageUrl;

  try {
    const normalized = new URL(imageUrl.trim());
    const host = normalized.hostname.toLowerCase();

    // Handle Google Drive URLs
    if (host.includes('drive.google.com')) {
      const id = normalized.searchParams.get('id') || normalized.pathname.split('/')[3];
      if (id) {
        return `https://drive.google.com/uc?export=download&id=${id}`;
      }
    }

    // Handle Dropbox URLs
    if (host.includes('dropbox.com')) {
      normalized.searchParams.set('dl', '1');
      normalized.searchParams.set('raw', '1');
      return normalized.toString();
    }

    // Handle GitHub URLs
    if (host.includes('github.com') && normalized.pathname.includes('/blob/')) {
      return normalized.toString().replace('/blob/', '/raw/');
    }

    return normalized.toString();
  } catch (error) {
    console.warn('URL normalization failed:', error.message);
    return imageUrl;
  }
}

/**
 * Downloads and validates remote image
 */
async function downloadImage(url) {
  try {
    const normalizedUrl = normalizeRemoteImageUrl(url);
    const response = await fetch(normalizedUrl, {
      redirect: 'follow',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.warn(`Failed to download image from ${normalizedUrl}: ${response.status}`);
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      console.warn(`Downloaded content is not an image: ${normalizedUrl} (${contentType})`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return { buffer: Buffer.from(arrayBuffer), contentType };
  } catch (error) {
    console.warn(`Error downloading image from ${url}:`, error.message);
    return null;
  }
}

/**
 * Resolves image data from file or URL
 */
export async function resolveImageData(file, imageUrl) {
  // Priority: Uploaded file > Cloudinary > Local storage > URL only
  
  if (file?.buffer) {
    try {
      // If Cloudinary is configured, upload there
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const cloudinaryResult = await uploadToCloudinary(file.buffer, file.originalname);
        return {
          data: null,
          contentType: null,
          cloudinaryUrl: cloudinaryResult.secure_url
        };
      }

      // Otherwise, compress and store locally
      const compressed = await compressImage(file.buffer);
      return { data: compressed, contentType: 'image/jpeg', cloudinaryUrl: null };
    } catch (error) {
      console.error('Image processing error:', error);
      return null;
    }
  }

  if (!imageUrl) return null;
  if (imageUrl.startsWith('/api/products/')) return null;

  // For URLs, validate first
  const isValid = await validateImageUrl(imageUrl);
  if (!isValid) {
    console.warn(`Invalid or inaccessible image URL: ${imageUrl}`);
    return null;
  }

  return { data: null, contentType: null, cloudinaryUrl: imageUrl };
}

/**
 * Maps product for API response
 */
function mapProductForResponse(product) {
  const item = product.toObject ? product.toObject() : { ...product };
  
  if (item.image?.data) {
    item.imageUrl = `/api/products/${item._id}/image`;
  }
  
  delete item.image;
  return item;
}

// Repository Methods
export async function getAllProducts() {
  if (useFallback) return [...products];
  
  try {
    const productsList = await Product.find()
      .sort({ createdAt: -1 })
      .lean();
    
    return productsList.map(mapProductForResponse);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id) {
  if (useFallback) return products.find((product) => product._id === id);
  
  try {
    return await Product.findById(id);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

export async function createProduct(payload, imageData) {
  if (useFallback) {
    const product = { ...payload, _id: `p${Date.now()}` };
    products.unshift(product);
    return product;
  }

  try {
    const product = new Product({ ...payload });
    
    if (imageData) {
      if (imageData.cloudinaryUrl) {
        product.imageUrl = imageData.cloudinaryUrl;
      } else if (imageData.data) {
        product.image = {
          data: imageData.data,
          contentType: imageData.contentType
        };
      }
    }

    const created = await product.save();
    return mapProductForResponse(created);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id, payload, imageData) {
  if (useFallback) {
    products = products.map((item) =>
      item._id === id ? { ...item, ...payload } : item
    );
    return products.find((item) => item._id === id);
  }

  try {
    const update = { ...payload };
    
    if (imageData) {
      if (imageData.cloudinaryUrl) {
        update.imageUrl = imageData.cloudinaryUrl;
      } else if (imageData.data) {
        update.image = {
          data: imageData.data,
          contentType: imageData.contentType
        };
      }
    }

    const product = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true
    });
    
    return mapProductForResponse(product);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id) {
  if (useFallback) {
    products = products.filter((item) => item._id !== id);
    return { success: true };
  }

  try {
    await Product.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}
