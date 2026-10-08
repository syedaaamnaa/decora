import mongoose from 'mongoose';
import { slugify, ensureUniqueSlug } from '../utils/slug.js';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'] },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Civil Works',
        'Interior Design',
        'Aluminum & Glass',
        'Doors & Windows',
        'Office Interiors',
        'Home Renovation',
        'Construction Materials',
      ],
    },
    description: String,
    features: [String],
    image: String,
    price: { type: String, default: 'On request' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate a unique slug from the title before validation.
// Skips when a slug was explicitly provided (e.g. an admin edit keeps its slug).
productSchema.pre('validate', async function () {
  if (!this.slug || (this.isModified('title') && !this.isModified('slug'))) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.title), this._id);
  }
});

export default mongoose.model('Product', productSchema);
