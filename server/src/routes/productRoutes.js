import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js'; 
import Review from '../models/Review.js'; 

const router = express.Router();

// @desc    Get all products from MongoDB with corrected live review priority analytics
// @route   GET /api/products
// @access  Public / Protected
router.get('/', async (req, res) => {
  try {
    // Use .lean() to get plain JS objects for faster processing
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    
    const mappedProducts = await Promise.all(products.map(async (product) => {
      const reviews = await Review.find({ productId: product._id })
        .populate('nlpResult')
        .sort({ createdAt: -1 })
        .lean();

      const totalReviews = reviews.length;
      let sentimentScore = 50; 
      let integrityScore = 100; 
      let positiveTakeaways = [];
      let negativeTakeaways = [];

      let sentimentDistribution = { positive: 0, neutral: 0, negative: 0 };
      
      let aspectTotals = {
        quality: { sum: 0, count: 0 },
        performance: { sum: 0, count: 0 },
        durability: { sum: 0, count: 0 },
        price: { sum: 0, count: 0 },
        "customer service": { sum: 0, count: 0 }
      };

      if (totalReviews > 0) {
        let totalSentimentSum = 0;
        let totalFakeScoreSum = 0;
        let validNlpResultsCount = 0;

        reviews.forEach(review => {
          let isPositive = false;
          let isNegative = false;

          if (review.nlpResult) {
            isPositive = review.nlpResult.sentimentLabel === 'POSITIVE';
            isNegative = review.nlpResult.sentimentLabel === 'NEGATIVE';
          } else {
            isPositive = review.rating >= 4;
            isNegative = review.rating <= 2;
          }

          if (isPositive) {
            sentimentDistribution.positive++;
            if (positiveTakeaways.length < 3) positiveTakeaways.push(review.reviewText);
          } else if (isNegative) {
            sentimentDistribution.negative++;
            if (negativeTakeaways.length < 3) negativeTakeaways.push(review.reviewText);
          } else {
            sentimentDistribution.neutral++;
          }

          if (review.nlpResult) {
            totalSentimentSum += review.nlpResult.sentimentScore;
            totalFakeScoreSum += review.nlpResult.fakeScore;
            validNlpResultsCount++;

            if (review.nlpResult.aspectScores) {
              const aspects = review.nlpResult.aspectScores;
              for (const [key, val] of Object.entries(aspects)) {
                const normKey = key.toLowerCase() === 'design' ? 'performance' : key.toLowerCase();
                
                if (aspectTotals[normKey] !== undefined) {
                  let scoreValue = 0.5;
                  
                  if (val !== undefined && val !== null) {
                    if (typeof val === 'number') {
                      scoreValue = val;
                    } else if (typeof val === 'object') {
                      // Corrected: Using rawScore to calculate the sentiment-aware score
                      const rawScore = val.score !== undefined ? val.score : (val.scoreValue !== undefined ? val.scoreValue : 0.5);
                      const sentiment = val.sentimentLabel || val.sentiment || 'NEUTRAL';
                      const isNeg = sentiment === 'NEGATIVE';
                      scoreValue = isNeg ? 1 - Number(rawScore) : Number(rawScore);
                    }
                  }
                  
                  aspectTotals[normKey].sum += scoreValue;
                  aspectTotals[normKey].count++;
                }
              }
            }
          }
        });

        if (validNlpResultsCount > 0) {
          sentimentScore = Math.round((totalSentimentSum / validNlpResultsCount) * 100);
          integrityScore = Math.round((1 - (totalFakeScoreSum / validNlpResultsCount)) * 100);
        } else {
          const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
          sentimentScore = Math.round((averageRating / 5) * 100);
        }
      }

      const aspectBreakdown = {};
      for (const [key, data] of Object.entries(aspectTotals)) {
        aspectBreakdown[key] = data.count > 0 ? Math.round((data.sum / data.count) * 100) : 50; 
      }

      const recentReviews = reviews.slice(0, 5).map(review => ({
        id: review._id,
        reviewText: review.reviewText,
        rating: review.rating,
        sentimentLabel: review.nlpResult?.sentimentLabel || (review.rating >= 4 ? 'POSITIVE' : review.rating <= 2 ? 'NEGATIVE' : 'NEUTRAL'),
        fakeScore: review.nlpResult?.fakeScore || 0,
        createdAt: review.createdAt
      }));

      return {
        id: product._id,
        title: product.name || product.title,
        description: product.description,
        catalogImage: product.poster || product.catalogImage,
        analytics: {
          totalReviews,
          sentimentScore,
          integrityScore,
          positiveTakeaways,
          negativeTakeaways,
          aspectBreakdown,
          sentimentDistribution,
          recentReviews
        }
      };
    }));

    res.status(200).json(mappedProducts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product catalog.", error: error.message });
  }
});

// @desc    Create and save a new product asset in MongoDB
// @route   POST /api/products
// @access  Private (Business Role Only)
router.post('/', protect, authorize('business'), async (req, res) => {
  try {
    const { title, description, launchStatus, catalogImage, price, category } = req.body;
    const product = await Product.create({
      name: title, 
      description,
      launchStatus: launchStatus || 'Launched',
      poster: catalogImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 
      price: price || 0, 
      category: category || 'General', 
      businessId: req.user._id 
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to register product asset.", error: error.message });
  }
});

export default router;