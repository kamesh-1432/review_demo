import React, { useState } from 'react';
import { ArrowLeft, Sparkles, ThumbsUp, ThumbsDown, Send, Star } from 'lucide-react';
import type { Product, CurrentPage } from '../types';

interface ReviewFormProps {
  selectedProduct: Product;
  onNavigate: (page: CurrentPage) => void;
  // Updated signature to support sending the chosen numerical rating along with text parameters
  onSubmit: (text: string, likes: string, dislikes: string, rating: number) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ selectedProduct, onNavigate, onSubmit }) => {
  const [text, setText] = useState('');
  const [likes, setLikes] = useState('');
  const [dislikes, setDislikes] = useState('');
  const [rating, setRating] = useState<number>(5); // Defaults to 5, adjustable interactively
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(text, likes, dislikes, rating);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => onNavigate('reviewer-dashboard')} 
        className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer border-none bg-transparent"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Return to Evaluation Matrix
      </button>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex gap-4 items-center border-b border-slate-100 pb-4">
          <img src={selectedProduct.catalogImage} className="w-16 h-16 rounded-xl object-cover border border-slate-200" alt="" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{selectedProduct.title}</h2>
            <p className="text-xs text-slate-500">Logging persistent structural NLP assessment arrays.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Interactive Numeric Star Selector Section */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              Select Rating Multiplier
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isLit = hoveredRating !== null ? starValue <= hoveredRating : starValue <= rating;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="p-1 -m-1 transition-transform active:scale-95 cursor-pointer border-none bg-transparent"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors duration-150 ${
                        isLit 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-slate-200 fill-transparent'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-xs font-semibold text-slate-400 ml-2">
                ({rating} Star{rating !== 1 ? 's' : ''})
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-500" /> Core Review Analysis Text
            </label>
            <textarea 
              required 
              rows={4} 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Detail your findings here. Our AI infrastructure will parse this string for weighted scores..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 resize-none" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-emerald-600" /> Explicit Likes
              </label>
              <input 
                type="text" 
                value={likes} 
                onChange={(e) => setLikes(e.target.value)} 
                placeholder="e.g. Speed, texture" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <ThumbsDown className="w-3 h-3 text-amber-600" /> Friction Vectors
              </label>
              <input 
                type="text" 
                value={dislikes} 
                onChange={(e) => setDislikes(e.target.value)} 
                placeholder="e.g. Cables, heat" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500" 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
            <Send className="w-3.5 h-3.5" /> Transmit Evaluation to Database
          </button>
        </form>
      </div>
    </div>
  );
};