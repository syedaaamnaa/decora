import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    role: String,
    company: String,
    rating: { type: Number, default: 5, min: 1, max: 5 },
    text: { type: String, required: [true, 'Text is required'] },
    avatar: String,
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
