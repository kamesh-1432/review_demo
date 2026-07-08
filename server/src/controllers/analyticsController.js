import Review from '../models/Review.js';
import NLPResult from '../models/NLPResult.js';

export const getProductSummary = async (req, res) => {
  try {
    const { productId } = req.params;

    // Gather all completed NLP documents for this product
    const reviews = await Review.find({ productId }).select('_id');
    const reviewIds = reviews.map(r => r._id);

    const nlpMetrics = await NLPResult.find({ reviewId: { $in: reviewIds } });

    if (!nlpMetrics.length) {
      return res.status(200).json({ message: "No analytics data compiled yet for this product." });
    }

    // Compute basic averages
    const total = nlpMetrics.length;
    const avgSentiment = nlpMetrics.reduce((acc, curr) => acc + curr.sentimentScore, 0) / total;
    const totalFlagged = nlpMetrics.filter(m => m.fakeScore > 0.65).length;

    res.status(200).json({
      totalReviews: total,
      averageSentimentScore: Math.round(avgSentiment * 100),
      flaggedFakeCount: totalFlagged,
    });
  } catch (error) {
    res.status(500).json({ message: 'Analytics compilation failed.', error: error.message });
  }
};