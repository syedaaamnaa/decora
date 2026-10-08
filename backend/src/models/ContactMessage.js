import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    phone: String,
    email: { type: String, required: [true, 'Email is required'] },
    service: String,
    message: { type: String, required: [true, 'Message is required'] },
    status: { type: String, enum: ['new', 'read', 'archived'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
