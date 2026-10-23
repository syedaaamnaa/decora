import mongoose from 'mongoose';

const demandSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    material: { type: String, default: 'Glass' },
    customer: { type: String, default: '' },
    length: { type: String, default: '' },
    width: { type: String, default: '' },
    quantity: { type: String, default: '1' },
    unit: { type: String, default: 'MM' },
    rotation: { type: String, default: 'VERTICAL' },
  },
  { _id: false }
);

const stockSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    material: { type: String, default: 'Glass' },
    length: { type: String, default: '' },
    width: { type: String, default: '' },
    quantity: { type: String, default: '1' },
    unit: { type: String, default: 'MM' },
    price: { type: String, default: '' },
  },
  { _id: false }
);

const cuttingDraftSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'workshop' },
    customerName: { type: String, default: '' },
    title: { type: String, default: '' },
    settings: {
      kerf: { type: String, default: '3' },
      edgeMargin: { type: String, default: '5' },
      pieceAllowance: { type: String, default: '0' },
    },
    demand: { type: [demandSchema], default: [] },
    stock: { type: [stockSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('CuttingDraft', cuttingDraftSchema);
