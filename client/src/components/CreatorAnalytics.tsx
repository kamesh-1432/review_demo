import React, { useState } from 'react';
import { 
  ArrowLeft, ThumbsUp, ThumbsDown, BarChart3, ShieldCheck, 
  AlertTriangle, MessageSquare, Star, Clock, Sparkles, Filter 
} from 'lucide-react';
import type { Product, CurrentPage, ReviewLog } from '../types';

interface CreatorAnalyticsProps {
  selectedProduct: Product;
  onNavigate: (page: CurrentPage) => void;
}

export const CreatorAnalytics: React.FC<CreatorAnalyticsProps> = ({ selectedProduct, onNavigate }) => {
  const [logFilter, setLogFilter] = useState<'ALL' | 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'>('ALL');

  // Safely resolve nested analytics data from our Canvas endpoints with fallback values
  const analytics = selectedProduct.analytics || {
    totalReviews: 0,
    sentimentScore: 50,
    integrityScore: 100,
    positiveTakeaways: ["No feedback telemetry recorded yet."],
    negativeTakeaways: ["No critical vectors flagged yet."],
    aspectBreakdown: { quality: 50, performance: 50, durability: 50, price: 50, "customer service": 50 },
    sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
    recentReviews: [] as ReviewLog[]
  };

  const {
    totalReviews,
    sentimentScore,
    integrityScore,
    positiveTakeaways,
    negativeTakeaways,
    aspectBreakdown,
    sentimentDistribution,
    recentReviews
  } = analytics;

  // Filter dynamic review logs for rendering
  const filteredReviews = recentReviews.filter(review => {
    if (logFilter === 'ALL') return true;
    return review.sentimentLabel === logFilter;
  });

  // Aspect metadata mapping to present beautifully colored progress bars
  const aspectMetadata = [
    { key: 'quality', label: 'Build Quality & Materials', color: 'bg-blue-600' },
    { key: 'performance', label: 'Processing & Performance', color: 'bg-indigo-600' },
    { key: 'durability', label: 'System Lifespan & Durability', color: 'bg-emerald-600' },
    { key: 'price', label: 'Value & Cost Efficiency', color: 'bg-purple-600' },
    { key: 'customer service', label: 'Support & Integration Quality', color: 'bg-teal-600' }
  ];

  // Helper to render rating stars
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={`w-3.5 h-3.5 ${index < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
      />
    ));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Upper Navigation & Context Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => onNavigate('creator-dashboard')} 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white px-3 py-1.5 rounded-lg shadow-sm cursor-pointer transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Creator Console
        </button>
        <span className="text-[11px] font-mono bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full w-fit">
          Live Telemetry Channel Connected
        </span>
      </div>

      {/* Main Product Header Card */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex gap-4 items-center">
          <img 
            src={selectedProduct.catalogImage} 
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs" 
            alt={selectedProduct.title} 
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                {selectedProduct.category || 'General'}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                {selectedProduct.launchStatus}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">{selectedProduct.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl line-clamp-1">{selectedProduct.description}</p>
          </div>
        </div>

        {/* Global Summary Statistics */}
        <div className="flex gap-4 self-stretch md:self-auto">
          <div className="bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-xl text-center flex-1 md:flex-initial min-w-[110px]">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Reviews logged</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{totalReviews}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-xl text-center flex-1 md:flex-initial min-w-[110px]">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Base Cost</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">${selectedProduct.price || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Core Sentiment Gauge */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">General Sentiment Score</span>
            <p className="text-[11px] text-slate-500">Calculated average sentiment weight based on lexical reviews.</p>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl font-black text-slate-900 tracking-tight">{sentimentScore}%</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              sentimentScore >= 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
              sentimentScore >= 50 ? 'bg-blue-50 text-blue-700 border border-blue-100' :
              'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
              {sentimentScore >= 75 ? 'OPTIMAL' : sentimentScore >= 50 ? 'STABLE' : 'CRITICAL'}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${sentimentScore}%` }} />
          </div>
        </div>

        {/* Spam/Integrity Shield */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Signal Integrity Metric</span>
            <p className="text-[11px] text-slate-500">Confidence ratio proving the validation score is free of duplicate bot spikes.</p>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl font-black text-slate-900 tracking-tight">{integrityScore}%</span>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded">
              SECURE SOURCE
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${integrityScore}%` }} />
          </div>
        </div>

        {/* Sentiment Volume Distribution Breakdown */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Feedback Ratio Distribution</span>
            <p className="text-[11px] text-slate-500">Relative distribution volumes of reviews recorded.</p>
          </div>
          <div className="space-y-2">
            {/* Multi-segmented distribution line bar */}
            <div className="w-full h-3.5 rounded-lg overflow-hidden flex border border-slate-200/20">
              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${totalReviews > 0 ? (sentimentDistribution.positive / totalReviews) * 100 : 33}%` }} title="Positive" />
              <div className="bg-slate-300 h-full transition-all" style={{ width: `${totalReviews > 0 ? (sentimentDistribution.neutral / totalReviews) * 100 : 34}%` }} title="Neutral" />
              <div className="bg-rose-400 h-full transition-all" style={{ width: `${totalReviews > 0 ? (sentimentDistribution.negative / totalReviews) * 100 : 33}%` }} title="Negative" />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 px-1 pt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Pos ({sentimentDistribution.positive})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" /> Neu ({sentimentDistribution.neutral})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> Neg ({sentimentDistribution.negative})</span>
            </div>
          </div>
        </div>

      </div>

      {/* Mid Section: Keyword Aspect Breakdowns and Semantic Takeaways */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Keyword Aspects list (Left 3 cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-600" /> Keyword Aspect Extraction Levels
            </h3>
            <p className="text-[11px] text-slate-500">Real-time ratings derived from keyword density and phrase patterns across all review bodies.</p>
          </div>

          <div className="space-y-5">
            {aspectMetadata.map(({ key, label, color }) => {
              const score = aspectBreakdown[key] !== undefined ? aspectBreakdown[key] : 50;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{label}</span>
                    <span className="font-mono font-bold text-slate-900">{score}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/25">
                    <div className={`h-full ${color} rounded-lg transition-all duration-500`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Semantic Summary Bullet Points (Right 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Positive Driver list */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-emerald-700">
              <ThumbsUp className="w-4 h-4" /> Positives & Driver Insights
            </h4>
            <div className="space-y-2">
              {positiveTakeaways.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-600 bg-emerald-50/50 border border-emerald-100/40 p-3 rounded-xl leading-relaxed flex gap-2 items-start">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Negative Friction list */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-rose-700">
              <ThumbsDown className="w-4 h-4" /> Friction Vectors & Issues
            </h4>
            <div className="space-y-2">
              {negativeTakeaways.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-600 bg-rose-50/40 border border-rose-100/40 p-3 rounded-xl leading-relaxed flex gap-2 items-start">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Section: Recent Logged Comments */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" /> Verified Reviewer Comments
            </h3>
            <p className="text-[11px] text-slate-500">Historical analysis comments parsed into Mongoose records.</p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit self-start sm:self-auto">
            <button 
              onClick={() => setLogFilter('ALL')} 
              className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${logFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              All
            </button>
            <button 
              onClick={() => setLogFilter('POSITIVE')} 
              className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${logFilter === 'POSITIVE' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-emerald-700'}`}
            >
              Positive
            </button>
            <button 
              onClick={() => setLogFilter('NEGATIVE')} 
              className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${logFilter === 'NEGATIVE' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-rose-700'}`}
            >
              Negative
            </button>
          </div>
        </div>

        {/* Comment Cards List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div key={review.id} className="border border-slate-200/60 rounded-xl p-4 space-y-3 bg-slate-50/20 hover:bg-white hover:shadow-xs transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                    <span className="text-[10px] text-slate-400 font-medium">|</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      review.sentimentLabel === 'POSITIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      review.sentimentLabel === 'NEGATIVE' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {review.sentimentLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> Spam: {Math.round(review.fakeScore * 100)}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  "{review.reviewText}"
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-500">No reviewer comments match the selected filter.</p>
              <p className="text-[10px] text-slate-400">Adjust filters or register new reviewer feedbacks inside your catalog space.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};