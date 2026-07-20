import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, ThumbsUp, ThumbsDown, Send, Star } from 'lucide-react';
import type { Product, CurrentPage } from '../types';

interface ReviewFormProps {
  selectedProduct: Product;
  onNavigate: (page: CurrentPage) => void;
  onSubmit: (text: string, likes: string, dislikes: string, rating: number) => void;
}

const ratingCopy: Record<number, string> = {
  1: 'Poor',
  2: 'Below average',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

export const ReviewForm: React.FC<ReviewFormProps> = ({ selectedProduct, onNavigate, onSubmit }) => {
  const [text, setText] = useState('');
  const [likes, setLikes] = useState('');
  const [dislikes, setDislikes] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(text, likes, dislikes, rating);
  };

  const displayedRating = hoveredRating ?? rating;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => onNavigate('reviewer-dashboard')}
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink cursor-pointer border-none bg-transparent"
      >
        <ArrowLeft className="w-4 h-4" /> Back to feed
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-surface border border-line rounded-2xl p-6 md:p-9 shadow-sm space-y-7"
      >
        <div className="flex gap-4 items-center border-b border-line pb-6">
          <img src={selectedProduct.catalogImage} className="w-16 h-16 rounded-xl object-cover border border-line" alt="" />
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">{selectedProduct.title}</h2>
            <p className="text-sm text-ink-soft mt-0.5">Your feedback becomes part of this product's signal.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="space-y-3">
            <label className="text-sm font-medium text-ink">Overall rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isLit = starValue <= displayedRating;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="p-1 -m-1 cursor-pointer border-none bg-transparent"
                  >
                    <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                      <Star
                        className={`w-8 h-8 transition-colors duration-150 ${
                          isLit ? 'text-pending fill-pending' : 'text-line fill-transparent'
                        }`}
                      />
                    </motion.div>
                  </button>
                );
              })}
              <span className="text-sm font-semibold text-ink-soft ml-2">
                {ratingCopy[displayedRating]}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-ledger" /> Your review
            </label>
            <textarea
              required
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What stood out? Be specific — this text is what turns into the product's sentiment and aspect scores."
              className="w-full bg-surface-sunken border border-line rounded-xl p-4 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ledger/30 focus:border-ledger transition-shadow resize-none leading-relaxed"
            />
            <p className="text-xs text-ink-faint">{text.length} characters</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5 text-verified" /> What you liked
              </label>
              <input
                type="text"
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
                placeholder="e.g. build quality, speed"
                className="w-full bg-surface-sunken border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ledger/30 focus:border-ledger transition-shadow"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink flex items-center gap-1.5">
                <ThumbsDown className="w-3.5 h-3.5 text-flag" /> What could improve
              </label>
              <input
                type="text"
                value={dislikes}
                onChange={(e) => setDislikes(e.target.value)}
                placeholder="e.g. battery life, price"
                className="w-full bg-surface-sunken border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ledger/30 focus:border-ledger transition-shadow"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-signal hover:bg-signal-hover text-white text-sm font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" /> Submit review
          </button>
        </form>
      </motion.div>
    </div>
  );
};