import mongoose from 'mongoose';
import { slugify, ensureUniqueSlug } from '../utils/slug.js';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'] },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    // Icon key consumed by the frontend icon component (e.g. 'civil', 'interior').
    icon: String,
    description: String,
    features: [String],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate a unique slug from the title before validation.
// Skips when a slug was explicitly provided (e.g. an admin edit keeps its slug).
serviceSchema.pre('validate', async function () {
  if (!this.slug || (this.isModified('title') && !this.isModified('slug'))) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.title), this._id);
  }
});

export default mongoose.model('Service', serviceSchema);
