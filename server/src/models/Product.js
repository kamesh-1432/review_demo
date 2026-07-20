import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  images: [{ type: String }],
  poster: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
   launchStatus: { type: String, enum: ['Launched', 'Upcoming'], default: 'Launched' },
  createdAt: { type: Date, default: Date.now }
});

// CRITICAL FIX: Ensure this exact default export is here
export default mongoose.model('Product', productSchema);