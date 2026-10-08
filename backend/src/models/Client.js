import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    industry: String,
    logo: { type: String, default: '' },
    website: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Client', clientSchema);
