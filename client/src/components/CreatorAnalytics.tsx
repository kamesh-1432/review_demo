import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ThumbsUp, ThumbsDown, BarChart3, ShieldCheck,
  AlertTriangle, MessageSquare, Star, Clock, Sparkles
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip
} from 'recharts';
import type { Product, CurrentPage, ReviewLog } from '../types';

interface CreatorAnalyticsProps {
  selectedProduct: Product;
  onNavigate: (page: CurrentPage) => void;
}

export const CreatorAnalytics: React.FC<CreatorAnalyticsProps> = ({ selectedProduct, onNavigate }) => {
  const [logFilter, setLogFilter] = useState<'ALL' | 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'>('ALL');

  const analytics = selectedProduct.analytics || {
    totalReviews: 0,
    sentimentScore: 50,
    integrityScore: 100,
    positiveTakeaways: ["No feedback recorded yet."],
    negativeTakeaways: ["No issues flagged yet."],
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

  const filteredReviews = recentReviews.filter((review) => {
    if (logFilter === 'ALL') return true;
    return review.sentimentLabel === logFilter;
  });

  const aspectMetadata = [
    { key: 'quality', label: 'Quality' },
    { key: 'performance', label: 'Performance' },
    { key: 'durability', label: 'Durability' },
    { key: 'price', label: 'Value' },
    { key: 'customer service', label: 'Support' }
  ];

  const radarData = aspectMetadata.map(({ key, label }) => ({
    aspect: label,
    score: aspectBreakdown[key] !== undefined ? aspectBreakdown[key] : 50
  }));

  const pieData = [
    { name: 'Positive', value: sentimentDistribution.positive, color: 'var(--color-verified)' },
    { name: 'Neutral', value: sentimentDistribution.neutral, color: 'var(--color-ink-faint)' },
    { name: 'Negative', value: sentimentDistribution.negative, color: 'var(--color-flag)' }
  ];
  const hasPieData = sentimentDistribution.positive + sentimentDistribution.neutral + sentimentDistribution.negative > 0;

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-3.5 h-3.5 ${index < rating ? 'text-pending fill-pending' : 'text-line'}`}
      />
    ));

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('creator-dashboard')}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink border border-line bg-surface px-3.5 py-2 rounded-lg shadow-sm cursor-pointer transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to console
        </button>
        <span className="text-[11px] font-data flex items-center gap-1.5 bg-ledger-soft text-ledger px-3 py-1.5 rounded-full w-fit">
          <span className="signal-pulse"><span></span><span></span><span></span></span>
          Live signal connected
        </span>
      </div>

      <div className="bg-surface border border-line p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex gap-4 items-center">
          <img
            src={selectedProduct.catalogImage}
            className="w-16 h-16 rounded-xl object-cover border border-line"
            alt={selectedProduct.title}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint bg-surface-sunken px-2 py-0.5 rounded">
                {selectedProduct.category || 'General'}
              </span>
              <span className="text-[10px] font-semibold text-verified bg-verified-soft px-2 py-0.5 rounded">
                {selectedProduct.launchStatus ?? 'Launched'}
              </span>
            </div>
            <h2 className="font-display text-xl font-semibold text-ink mt-1">{selectedProduct.title}</h2>
            <p className="text-sm text-ink-soft mt-0.5 max-w-xl line-clamp-1">{selectedProduct.description}</p>
          </div>
        </div>

        <div className="flex gap-4 self-stretch md:self-auto">
          <div className="bg-surface-sunken border border-line px-5 py-3.5 rounded-xl text-center flex-1 md:flex-initial min-w-[110px]">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-faint">Reviews</span>
            <span className="font-data text-2xl font-semibold text-ink mt-1 block">{totalReviews}</span>
          </div>
          <div className="bg-surface-sunken border border-line px-5 py-3.5 rounded-xl text-center flex-1 md:flex-initial min-w-[110px]">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-faint">Price</span>
            <span className="font-data text-2xl font-semibold text-ink mt-1 block">${selectedProduct.price ?? '0.00'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface border border-line p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint block">Sentiment score</span>
            <p className="text-xs text-ink-soft">Average sentiment across all reviews.</p>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-data text-4xl font-semibold text-ink tracking-tight">{sentimentScore}%</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              sentimentScore >= 75 ? 'bg-verified-soft text-verified' :
              sentimentScore >= 50 ? 'bg-ledger-soft text-ledger' :
              'bg-flag-soft text-flag'
            }`}>
              {sentimentScore >= 75 ? 'STRONG' : sentimentScore >= 50 ? 'STEADY' : 'NEEDS WORK'}
            </span>
          </div>
          <div className="w-full h-2 bg-surface-sunken rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${sentimentScore}%` }}
              transition={{ duration: 0.7 }}
              className="h-full bg-ledger rounded-full"
            />
          </div>
        </div>

        <div className="bg-surface border border-line p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint block">Integrity score</span>
            <p className="text-xs text-ink-soft">Confidence that this signal is free of spam or duplicate reviews.</p>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-data text-4xl font-semibold text-ink tracking-tight">{integrityScore}%</span>
            <span className="text-[10px] font-bold bg-verified-soft text-verified px-2 py-0.5 rounded">VERIFIED</span>
          </div>
          <div className="w-full h-2 bg-surface-sunken rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${integrityScore}%` }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="h-full bg-verified rounded-full"
            />
          </div>
        </div>

        <div className="bg-surface border border-line p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-2 md:col-span-2 lg:col-span-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint block">Feedback mix</span>
          {hasPieData ? (
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={28} outerRadius={44} paddingAngle={2} stroke="none">
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--color-line)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-verified" /> Positive ({sentimentDistribution.positive})</p>
                <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-ink-faint" /> Neutral ({sentimentDistribution.neutral})</p>
                <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-flag" /> Negative ({sentimentDistribution.negative})</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-ink-faint py-6 text-center">No reviews yet to break down.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-surface border border-line p-6 rounded-2xl shadow-sm space-y-4">
          <div className="space-y-1 border-b border-line pb-4">
            <h3 className="font-display font-semibold text-base text-ink flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-ledger" /> Aspect breakdown
            </h3>
            <p className="text-xs text-ink-soft">How reviewers rate each aspect of this product.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="var(--color-line)" />
                <PolarAngleAxis dataKey="aspect" tick={{ fill: 'var(--color-ink-soft)', fontSize: 12 }} />
                <Radar
                  dataKey="score"
                  stroke="var(--color-ledger)"
                  fill="var(--color-ledger)"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--color-line)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-line p-6 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-semibold text-xs text-verified uppercase tracking-wider flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4" /> What's working
            </h4>
            <div className="space-y-2">
              {positiveTakeaways.map((item, idx) => (
                <div key={idx} className="text-xs text-ink-soft bg-verified-soft/50 border border-verified/10 p-3 rounded-xl leading-relaxed flex gap-2 items-start">
                  <Sparkles className="w-3.5 h-3.5 text-verified flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-line p-6 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-semibold text-xs text-flag uppercase tracking-wider flex items-center gap-1.5">
              <ThumbsDown className="w-4 h-4" /> Needs attention
            </h4>
            <div className="space-y-2">
              {negativeTakeaways.map((item, idx) => (
                <div key={idx} className="text-xs text-ink-soft bg-flag-soft/60 border border-flag/10 p-3 rounded-xl leading-relaxed flex gap-2 items-start">
                  <AlertTriangle className="w-3.5 h-3.5 text-flag flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-line p-6 rounded-2xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-base text-ink flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-ledger" /> Reviewer comments
            </h3>
            <p className="text-xs text-ink-soft">Individual written feedback from reviewers.</p>
          </div>

          <div className="flex items-center gap-2 bg-surface-sunken p-1 rounded-lg border border-line w-fit self-start sm:self-auto">
            {(['ALL', 'POSITIVE', 'NEGATIVE'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setLogFilter(f)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  logFilter === f
                    ? f === 'POSITIVE' ? 'bg-surface text-verified shadow-sm'
                    : f === 'NEGATIVE' ? 'bg-surface text-flag shadow-sm'
                    : 'bg-surface text-ink shadow-sm'
                    : 'text-ink-faint hover:text-ink'
                }`}
              >
                {f === 'ALL' ? 'All' : f === 'POSITIVE' ? 'Positive' : 'Negative'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div key={review.id} className="border border-line rounded-xl p-4 space-y-3 bg-surface-sunken/40 hover:bg-surface hover:shadow-sm transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                    <span className="text-[10px] text-ink-faint font-medium">|</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      review.sentimentLabel === 'POSITIVE' ? 'bg-verified-soft text-verified' :
                      review.sentimentLabel === 'NEGATIVE' ? 'bg-flag-soft text-flag' :
                      'bg-surface-sunken text-ink-soft'
                    }`}>
                      {review.sentimentLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-ink-faint">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 font-data">
                      <ShieldCheck className="w-3 h-3 text-verified" /> Spam: {Math.round(review.fakeScore * 100)}%
                    </span>
                  </div>
                </div>

                <p className="text-sm text-ink leading-relaxed">{review.reviewText}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border border-dashed border-line rounded-xl bg-surface-sunken/40">
              <MessageSquare className="w-8 h-8 text-ink-faint mx-auto mb-2" />
              <p className="text-sm font-medium text-ink-soft">No comments match this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};