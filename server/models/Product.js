import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },

    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      maxlength: [50, 'Brand cannot exceed 50 characters']
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Smartphones', 'Earbuds', 'Chargers', 'Cables', 'Cases', 'Accessories', 'Services'],
        message: 'Invalid category selected'
      }
    },

    // Description & Details
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Image Handling
    imageUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional field
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Invalid image URL format'
      }
    },

    // Image Storage (for uploaded files)
    image: {
      data: Buffer,
      contentType: String
    },

    // Product Status
    availability: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Coming Soon'],
      default: 'In Stock'
    },

    featured: {
      type: Boolean,
      default: false,
      index: true // Index for featured product queries
    },

    // Stock Management
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative']
    }
  },
  {
    timestamps: true,
    // Automatically add createdAt and updatedAt
  }
);

// Compound index for better query performance
productSchema.index({ featured: 1, createdAt: -1 });
productSchema.index({ category: 1, availability: 1 });

// Virtual for checking if product is available
productSchema.virtual('isAvailable').get(function () {
  return this.availability === 'In Stock' && this.stock > 0;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
