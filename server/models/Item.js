import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Electronics',
        'Books',
        'Furniture',
        'Sports Equipment',
        'Kitchen Appliances',
        'Tools',
        'Clothing',
        'Other',
      ],
      default: 'Tools',
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    images: {
      type: [String],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Please provide at least one item image',
      },
      default: [
        'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80',
      ],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sharingType: {
      type: String,
      enum: ['free', 'rent', 'deposit_only'],
      default: 'free',
    },
    pricePerDay: {
      type: Number,
      default: 0,
      min: [0, 'Price per day cannot be negative'],
    },
    depositAmount: {
      type: Number,
      default: 0,
      min: [0, 'Deposit cannot be negative'],
    },
    location: {
      neighborhood: { type: String, default: 'Mission District' },
      city: { type: String, default: 'San Francisco' },
      state: { type: String, default: 'CA' },
      zip: { type: String, default: '94110' },
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'borrowed', 'reserved', 'maintenance'],
      default: 'available',
    },
    rulesAndConditions: {
      type: String,
      default: 'Please return in clean condition. Pick up in person with photo ID verification.',
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    favoritesCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  { timestamps: true }
);

// Text index for search
itemSchema.index({ title: 'text', description: 'text', 'location.neighborhood': 'text', 'location.city': 'text' });

export default mongoose.model('Item', itemSchema);
