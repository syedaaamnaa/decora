import mongoose from 'mongoose';

const demandSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    material: { type: String, default: 'Glass' },
    customer: { type: String, default: '' },
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'MM' },
    rotation: { type: String, default: 'VERTICAL' },
    allowRotation: { type: Boolean, default: false },
  },
  { _id: false }
);

const stockSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    material: { type: String, default: 'Glass' },
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'MM' },
    price: { type: Number, default: null },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    kerf: { type: Number, default: 3 },
    edgeMargin: { type: Number, default: 5 },
    pieceAllowance: { type: Number, default: 0 },
    unit: { type: String, default: 'MM' },
  },
  { _id: false }
);

const statisticsSchema = new mongoose.Schema(
  {
    totalSheets: { type: Number, default: 0 },
    totalSheetArea: { type: Number, default: 0 },
    usedArea: { type: Number, default: 0 },
    wasteArea: { type: Number, default: 0 },
    wastePercent: { type: Number, default: 0 },
    utilizationPercent: { type: Number, default: 0 },
  },
  { _id: false }
);

const cuttingPlanSchema = new mongoose.Schema(
  {
    planNumber: { type: Number, required: true, index: true },
    title: { type: String, default: '' },
    customerName: { type: String, default: '' },
    status: {
      type: String,
      enum: ['DRAFT', 'ACCEPTED'],
      default: 'DRAFT',
      index: true,
    },
    settings: { type: settingsSchema, default: () => ({}) },
    demand: { type: [demandSchema], default: [] },
    stock: { type: [stockSchema], default: [] },
    sheets: { type: [mongoose.Schema.Types.Mixed], default: [] },
    statistics: { type: statisticsSchema, default: () => ({}) },
    acceptedAt: { type: Date, default: null },
  },
  { timestamps: true, minimize: false }
);

cuttingPlanSchema.index({ createdAt: -1 });

export default mongoose.model('CuttingPlan', cuttingPlanSchema);
