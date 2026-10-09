import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Slide name is required'], trim: true, maxlength: 80 },
    heading: { type: String, required: [true, 'Heading is required'], trim: true, maxlength: 140 },
    highlightText: { type: String, trim: true, maxlength: 80, default: '' },
    description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: 320 },
    image: { type: String, required: [true, 'Background image is required'], trim: true },
    buttonText: { type: String, trim: true, maxlength: 40, default: '' },
    buttonLink: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: (value) => !value || /^(\/|https?:\/\/)/i.test(value),
        message: 'Button link must be a relative path or an HTTP(S) URL',
      },
    },
    order: { type: Number, required: true, default: 0, min: 0 },
    active: { type: Boolean, default: true },
    overlayOpacity: { type: Number, default: 58, min: 20, max: 90 },
  },
  { timestamps: true }
);

heroSlideSchema.pre('validate', function () {
  if (this.highlightText && !this.heading.includes(this.highlightText)) {
    this.invalidate('highlightText', 'Highlighted text must appear in the heading');
  }
  if (Boolean(this.buttonText) !== Boolean(this.buttonLink)) {
    this.invalidate('buttonLink', 'Button text and link must both be provided');
  }
});

heroSlideSchema.index({ order: 1, createdAt: 1 });

export default mongoose.model('HeroSlide', heroSlideSchema);
