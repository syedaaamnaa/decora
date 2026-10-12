import mongoose from 'mongoose';

/**
 * Generic, key/value site content store.
 *
 * Each dashboard-editable "section" of the website is stored as one document:
 *   { key: 'home',   data: { about: {...}, servicesHeading: {...}, ... } }
 *   { key: 'site',   data: { fullName, phone, address, social, ... } }
 *
 * `data` is intentionally Mixed so any nested shape (objects, arrays, image
 * URLs, lists of links, …) can be saved without schema migrations.
 */
const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

export default mongoose.model('Content', contentSchema);
