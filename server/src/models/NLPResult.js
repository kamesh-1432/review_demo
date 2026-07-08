import mongoose from 'mongoose';

const nlpResultSchema = new mongoose.Schema({
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
  sentimentScore: { type: Number, required: true }, // 0 to 1
  sentimentLabel: { type: String, enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'], required: true },
  aspectScores: {
    price: { sentiment: String, score: Number },
    quality: { sentiment: String, score: Number },
    design: { sentiment: String, score: Number },
    delivery: { sentiment: String, score: Number },
    customerService: { sentiment: String, score: Number },
    performance: { sentiment: String, score: Number },
    durability: { sentiment: String, score: Number }
  },
  topics: [{ type: String }],
  embeddingVector: [{ type: Number }], // Store high-dimensional vectors for custom analytics
  fakeScore: { type: Number, required: true }, // 0 to 1
  processedAt: { type: Date, default: Date.now }
});

export default mongoose.model('NLPResult', nlpResultSchema);