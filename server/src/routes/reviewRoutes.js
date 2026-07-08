import express from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
// Import your AI analysis controller function (adjust name based on your controller file)
import { analyzeReviewSimulator } from '../controllers/reviewController.js'; 

const router = express.Router();

// 1. ADD THIS NEW ROUTE AT THE TOP (Before the dynamic :productId parameter)
router.post('/analyze', analyzeReviewSimulator);

// Publicly browse reviews
router.get('/:productId', getProductReviews);

// Only reviewers can compose reviews
router.post('/:productId', protect, authorize('reviewer'), createReview);

export default router;