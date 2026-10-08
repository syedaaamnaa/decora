import mongoose from 'mongoose';
import { slugify, ensureUniqueSlug } from '../utils/slug.js';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'] },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Residential', 'Commercial', 'Interior', 'Civil', 'Renovation'],
    },
    location: String,
    client: String,
    year: Number,
    area: String,
    status: { type: String, enum: ['Completed', 'In Progress'], default: 'Completed' },
    description: String,
    scope: [String],
    images: [String],
    cover: String,
    featured: { type: Boolean, default: false },
    testimonial: {
      quote: String,
      author: String,
      role: String,
    },
    completedAt: String,
  },
  { timestamps: true }
);

// Auto-generate a unique slug from the title before validation.
// Skips when a slug was explicitly provided (e.g. an admin edit keeps its slug).
projectSchema.pre('validate', async function () {
  if (!this.slug || (this.isModified('title') && !this.isModified('slug'))) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.title), this._id);
  }
});

export default mongoose.model('Project', projectSchema);
