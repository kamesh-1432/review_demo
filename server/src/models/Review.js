import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewText: { type: String, required: true, minlength: 20 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  nlpResult: { type: mongoose.Schema.Types.ObjectId, ref: 'NLPResult' },
  isVerified: { type: Boolean, default: false },
  isFlagged: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Review', reviewSchema);