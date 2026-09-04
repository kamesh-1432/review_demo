import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 1. FORTIFIED CORS SETTINGS (Placed at the very top of the middleware stack)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. BODY PARSING MIDDLEWARE

app.use(express.json({ limit: '8mb' }));
// 3. OPTIONAL INTERNAL REQUEST LOGGER (Extremely useful for debugging frontend hits)
app.use((req, res, next) => {
  console.log(`📡 Inbound Request: ${req.method} -> ${req.originalUrl}`);
  next();
});

// Main App Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes); // Handles: http://localhost:5001/api/reviews/analyze
app.use('/api/analytics', analyticsRoutes);

// Public Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', environment: 'Core Gateway API' });
});

// Root fallback route for unexpected structural requests
app.use('/*any', (req, res) => {
  res.status(404).json({ error: `Path ${req.originalUrl} not discovered on this server.` });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 System Online. Core Gateway API running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ Database Initialization Failed:', err));