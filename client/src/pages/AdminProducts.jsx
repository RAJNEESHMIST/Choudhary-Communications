import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import AdminSidebar from '../components/AdminSidebar.jsx';
import { useToast } from '../components/Toast.jsx';
import { ToastContainer } from '../components/Toast.jsx';
import { ProductCardSkeleton } from '../components/SkeletonLoader.jsx';
import { isValidImageUrl, getImageSource, FALLBACK_IMAGE, preloadImage } from '../utils/imageValidation.js';

const emptyProduct = {
  name: '',
  price: '',
  brand: '',
  category: 'Smartphones',
  shortDescription: '',
  imageUrl: '',
  availability: 'In Stock',
  featured: false
};

const categories = ['Smartphones', 'Earbuds', 'Chargers', 'Cables', 'Cases', 'Accessories', 'Services'];

export default function AdminProducts() {
  const { products, setProducts } = useApp();
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    setFilteredProducts(
      products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  const handleImageFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'error');
      return;
    }

    const resizeImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
          canvas.width = Math.round(width * ratio);
          canvas.height = Math.round(height * ratio);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(null);
              resolve(new File([blob], file.name.replace(/\s+/g, '_'), { type: blob.type }));
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve(null);
        img.src = URL.createObjectURL(file);
      });
    };

    const resized = await resizeImage(file, 1200, 1200, 0.8);
    const finalFile = resized || file;
    setImageFile(finalFile);

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result || '');
    reader.readAsDataURL(finalFile);
    showToast('Image selected and resized for upload', 'success');
  };

  const handleImageUrlChange = async (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setImageFile(null);

    if (!url.trim()) {
      setImagePreview('');
      return;
    }

    if (!isValidImageUrl(url)) {
      setImagePreview('');
      return;
    }

    try {
      await preloadImage(url);
      setImagePreview(url);
    } catch {
      setImagePreview('');
      showToast('Image URL is not accessible', 'warning');
    }
  };

  const resetForm = () => {
    setFormData(emptyProduct);
    setImageFile(null);
    setImagePreview('');
    setEditProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData(product);
    setImagePreview(getImageSource(product.imageUrl, apiBase) || FALLBACK_IMAGE);
    setImageFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name.trim()) {
        showToast('Product name is required', 'error');
        setIsLoading(false);
        return;
      }

      if (!formData.price || Number(formData.price) <= 0) {
        showToast('Please enter a valid price', 'error');
        setIsLoading(false);
        return;
      }

      if (!formData.brand.trim()) {
        showToast('Brand is required', 'error');
        setIsLoading(false);
        return;
      }

      if (!formData.shortDescription.trim()) {
        showToast('Description is required', 'error');
        setIsLoading(false);
        return;
      }

      if (!imageFile && !imagePreview && !editProduct) {
        showToast('Please provide a product image', 'error');
        setIsLoading(false);
        return;
      }

      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('price', Number(formData.price));
      payload.append('brand', formData.brand.trim());
      payload.append('category', formData.category);
      payload.append('shortDescription', formData.shortDescription.trim());
      payload.append('availability', formData.availability);
      payload.append('featured', formData.featured ? 'true' : 'false');

      if (imageFile) {
        payload.append('imageFile', imageFile);
      } else if (formData.imageUrl && !editProduct) {
        payload.append('imageUrl', formData.imageUrl);
      }

      const url = editProduct ? `${apiBase}/api/products/${editProduct._id}` : `${apiBase}/api/products`;
      const method = editProduct ? 'PUT' : 'POST';
      const response = await fetch(url, { method, body: payload });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save product');
      }

      const savedProduct = await response.json();
      const saved = savedProduct?.data || savedProduct;
      const message = editProduct ? 'Product updated successfully' : 'Product added successfully';

      if (editProduct) {
        setProducts(products.map((p) => (p._id === saved._id ? saved : p)));
      } else {
        setProducts([...products, saved]);
      }

      showToast(message, 'success');
      resetForm();
    } catch (error) {
      showToast(error.message || 'Error saving product', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`${apiBase}/api/products/${productId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter((p) => p._id !== productId));
      showToast('Product deleted successfully', 'success');
      setDeleteConfirm(null);
    } catch (error) {
      showToast(error.message || 'Error deleting product', 'error');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <AdminSidebar />
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Products</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Product management</h1>
          </div>
          <button
            onClick={() => {
              setFormData(emptyProduct);
              setEditProduct(null);
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Add product
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="mt-6 grid gap-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
              <div className="grid gap-4">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Product name
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Product name"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Brand
                  <input
                    value={formData.brand}
                    onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                    placeholder="Brand"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Short description
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="Short description"
                    rows="3"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Price (₹)
                    <input
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      type="number"
                      placeholder="Price"
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Category
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">Product image</p>
                  <div className="overflow-hidden rounded-3xl bg-slate-100">
                    <img
                      src={imagePreview || (editProduct && getImageSource(editProduct.imageUrl, apiBase)) || FALLBACK_IMAGE}
                      alt="Product preview"
                      className="h-48 w-full object-cover"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    Upload image
                  </button>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs font-medium text-slate-500">
                      <span className="bg-white px-2">OR</span>
                    </div>
                  </div>
                  <label className="block text-sm font-medium text-slate-700">
                    Image URL
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="Image URL"
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    Featured
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Availability
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData((prev) => ({ ...prev, availability: e.target.value }))}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {['In Stock', 'Out of Stock', 'Coming Soon'].map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-3xl bg-success px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {editProduct ? 'Update product' : 'Save product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search products by name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>

          <div className="overflow-x-auto rounded-[28px] bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Availability</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                      {products.length === 0 ? 'No products yet. Add one to get started!' : 'No products match your search.'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={(function () {
                              const src = getImageSource(product.imageUrl, apiBase) || FALLBACK_IMAGE;
                              return src.includes('?') ? `${src}&size=thumb` : `${src}?size=thumb`;
                            })()}
                            alt={product.name}
                            className="h-16 w-16 rounded-2xl object-cover bg-slate-100"
                            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-950 truncate">{product.name}</p>
                            <p className="text-sm text-slate-500 truncate">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-emerald-600">₹{product.price}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">{product.category}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.availability === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {product.availability}
                        </span>
                      </td>
                      <td className="px-4 py-4 space-x-2">
                        <button onClick={() => handleEdit(product)} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">Edit</button>
                        <button onClick={() => setDeleteConfirm(product._id)} className="rounded-xl bg-danger px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-panel">
            <h3 className="text-xl font-semibold text-slate-950">Delete product?</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">This action cannot be undone. Are you sure you want to remove this product from your catalog?</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => handleDelete(deleteConfirm)} className="w-full rounded-3xl bg-danger px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
