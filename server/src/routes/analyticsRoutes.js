import express from 'express';
import NLPResult from '../models/NLPResult.js';

const router = express.Router();

// @desc    Get macro-level analytics from all stored NLP evaluations
router.get('/overview', async (req, res) => {
  try {
    // MongoDB Aggregation Pipeline to compute high-level KPIs in a single query pass
    const stats = await NLPResult.aggregate([
      {
        $group: {
          _id: null,
          totalEvaluations: { $sum: 1 },
          averageSentiment: { $avg: '$sentimentScore' },
          averageSpamScore: { $avg: '$fakeScore' },
          flaggedSpamCount: {
            $sum: { $cond: [{ $gt: ['$fakeScore', 0.65] }, 1, 0] }
          }
        }
      }
    ]);

    // Handle case where database collection is completely fresh/empty
    const result = stats[0] || {
      totalEvaluations: 0,
      averageSentiment: 0.5,
      averageSpamScore: 0.0,
      flaggedSpamCount: 0
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('❌ Analytics Engine Failure:', error.message);
    res.status(500).json({ message: 'Failed to aggregate system analytics.', error: error.message });
  }
});

export default router;