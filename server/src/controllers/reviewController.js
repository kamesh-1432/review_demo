import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import NLPResult from '../models/NLPResult.js';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Helper function to safely align Python ABSA properties with Mongoose NLP Schema
const formatAspectScores = (rawAspectScores) => {
  if (!rawAspectScores) return {};
  
  const formatted = {};
  const aspects = ["price", "quality", "design", "delivery", "customer service", "performance", "durability"];
  
  aspects.forEach(aspect => {
    if (rawAspectScores[aspect]) {
      formatted[aspect] = {
        sentimentLabel: rawAspectScores[aspect].sentimentLabel || rawAspectScores[aspect].sentiment || 'NEUTRAL',
        score: rawAspectScores[aspect].score !== undefined ? Number(rawAspectScores[aspect].score) : 0.5
      };
    } else {
      formatted[aspect] = { sentimentLabel: 'NEUTRAL', score: 0.5 };
    }
  });
  
  return formatted;
};

// @desc Submit a review & trigger NLP processing
export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviewContent = req.body.reviewText || req.body.text;
    const rating = req.body.rating !== undefined ? Number(req.body.rating) : 5;

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product asset not found in database.' });
    }

    if (!reviewContent) {
      return res.status(400).json({ message: 'Review content cannot be empty.' });
    }

    // Call FastAPI AI service with aligned payload containing both text and rating
    let nlpData = {
      sentimentLabel: rating >= 4 ? 'POSITIVE' : 'NEGATIVE',
      sentimentScore: rating / 5,
      fakeScore: 0.05,
      aspectScores: { quality: { score: rating/5, sentiment: 'POSITIVE' } }
    };

    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/nlp/analyze`, { 
        text: reviewContent,
        rating: rating
      });
      if (aiResponse.data) {
        nlpData = aiResponse.data;
      }
    } catch (aiErr) {
      console.warn("⚠️ AI Service offline, falling back to rating metrics:", aiErr.message);
    }

    // Generate a temporary ID so we can bypass the required validation rule
    const placeholderReviewId = new mongoose.Types.ObjectId();

    // Save NLP results with the temporary placeholder reviewId
    const nlpResult = await NLPResult.create({
      reviewId: placeholderReviewId,
      sentimentLabel: nlpData.sentimentLabel,
      sentimentScore: nlpData.sentimentScore,
      fakeScore: nlpData.fakeScore,
      aspectScores: formatAspectScores(nlpData.aspectScores),
      topics: nlpData.topics || []
    });

    // Create the actual Review Document
    const review = await Review.create({
      productId,
      reviewerId: req.user._id,
      reviewText: reviewContent,
      rating: rating,
      isVerified: true,
      nlpResult: nlpResult._id
    });

    // Link the real Review ID back to the NLPResult document and save
    nlpResult.reviewId = review._id;
    await nlpResult.save();

    res.status(201).json({ message: 'Review processed successfully.', review });
  } catch (error) {
    console.error("❌ MERN Controller Error:", error);
    res.status(500).json({ message: 'Internal review processing error.', error: error.message });
  }
};

// @desc Get all reviews for a specific product
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('reviewerId', 'name avatar')
      .populate('nlpResult')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews.', error: error.message });
  }
};

// @desc Process simulator tests, run AI engine, and log results natively
export const analyzeReviewSimulator = async (req, res) => {
  try {
    const reviewContent = req.body.reviewText || req.body.text;
    const rating = req.body.rating !== undefined ? Number(req.body.rating) : 5;

    if (!reviewContent) {
      return res.status(400).json({ message: 'Evaluation text is required.' });
    }

    let nlpData = {
      sentimentLabel: 'NEUTRAL',
      sentimentScore: 0.5,
      fakeScore: 0.02,
      aspectScores: {}
    };

    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/nlp/analyze`, { 
        text: reviewContent,
        rating: rating
      });
      nlpData = aiResponse.data;
    } catch (aiErr) {
      console.error("❌ AI Service communication failed:", aiErr.message);
      return res.status(503).json({ message: "AI pipeline offline." });
    }

    const mockProductId = new mongoose.Types.ObjectId("65eeda000000000000000001");
    const mockReviewerId = new mongoose.Types.ObjectId("65eeda000000000000000002");
    const placeholderReviewId = new mongoose.Types.ObjectId();

    // Persist NLP data with placeholder id
    const nlpResult = await NLPResult.create({
      reviewId: placeholderReviewId,
      sentimentLabel: nlpData.sentimentLabel,
      sentimentScore: nlpData.sentimentScore,
      fakeScore: nlpData.fakeScore,
      aspectScores: formatAspectScores(nlpData.aspectScores),
      topics: nlpData.topics || []
    });

    // Persist Review
    const review = await Review.create({
      productId: mockProductId,
      reviewerId: mockReviewerId,
      reviewText: reviewContent,
      rating: rating,
      isVerified: true,
      nlpResult: nlpResult._id
    });

    nlpResult.reviewId = review._id;
    await nlpResult.save();

    res.status(201).json({
      message: "Simulator run completed successfully.",
      review,
      nlpResult
    });
  } catch (error) {
    console.error('❌ Complete Simulator Subsystem processing failure:', error);
    res.status(500).json({ message: 'Internal simulator microservice error.', error: error.message });
  }
};