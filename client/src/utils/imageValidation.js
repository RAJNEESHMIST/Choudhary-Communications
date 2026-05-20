/**
 * Validates image URL by checking if it's a valid URL format
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const urlObj = new URL(url.trim());
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Checks if URL is a local API path
 */
export function isLocalImagePath(url) {
  if (!url) return false;
  return url.startsWith('/api/products/') || url.includes('localhost') || url.includes('127.0.0.1');
}

/**
 * Validates image accessibility by attempting to load it
 */
export async function validateImageUrl(url) {
  if (!isValidImageUrl(url) && !isLocalImagePath(url)) return false;

  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return response.ok || response.status === 0; // 0 for no-cors
  } catch {
    return false;
  }
}

/**
 * Gets the correct image source path
 */
export function getImageSource(imageUrl, apiBase) {
  if (!imageUrl) return null;

  // If it's already a full URL, use it directly
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a local path, prepend API base
  if (imageUrl.startsWith('/')) {
    return `${apiBase}${imageUrl}`;
  }

  return imageUrl;
}

/**
 * Default fallback image (inline SVG)
 */
export const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23e2e8f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="24" fill="%2364748b"%3EImage Not Available%3C/text%3E%3C/svg%3E';

/**
 * Preloads an image
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}
