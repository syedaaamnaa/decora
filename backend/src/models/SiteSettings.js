import mongoose from 'mongoose';

/**
 * Single-document site-wide settings (hero copy, contact info, socials, stats, about).
 * The `key` field keeps it a singleton — upserted under key = 'site'.
 */
const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site', unique: true },
    companyName: String,
    tagline: String,
    phone: String,
    whatsapp: String,
    email: String,
    address: String,
    hours: String,
    mapEmbed: String,
    social: {
      instagram: String,
      linkedin: String,
      facebook: String,
      youtube: String,
    },
    about: {
      story: String,
      mission: String,
      vision: String,
      values: [String],
    },
    stats: {
      projects: Number,
      clients: Number,
      years: Number,
      cities: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
