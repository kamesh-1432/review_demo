import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle2, Clock3 } from 'lucide-react';
import type { Product, CurrentPage } from '../types';

interface ReviewerDashboardProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: CurrentPage) => void;
}

type FeedFilter = 'ALL' | 'Launched' | 'Upcoming';

// Derives a short, stable label from a creator id so each card reads like
// a post from a real account, without requesting any new backend field.
const creatorInitials = (creatorId?: string) => {
  if (!creatorId) return 'CR';
  const cleaned = String(creatorId).replace(/[^a-zA-Z0-9]/g, '');
  return (cleaned.slice(0, 2) || 'CR').toUpperCase();
};

export const ReviewerDashboard: React.FC<ReviewerDashboardProps> = ({
  products,
  onSelectProduct,
  onNavigate
}) => {
  const [filter, setFilter] = useState<FeedFilter>('ALL');

  // Defensive guard against non-array payloads
  const productList = Array.isArray(products) ? products : [];

  const filtered = useMemo(() => {
    if (filter === 'ALL') return productList;
    return productList.filter((p) => p.launchStatus === filter);
  }, [productList, filter]);

  const filters: { key: FeedFilter; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'Launched', label: 'Launched' },
    { key: 'Upcoming', label: 'Upcoming' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Review feed</h2>
          <p className="text-sm text-ink-soft mt-1">Pick a product to evaluate and send your signal.</p>
        </div>

        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
                filter === f.key
                  ? 'bg-ledger text-white border-ledger'
                  : 'bg-surface text-ink-soft border-line hover:border-ink-faint'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="bg-surface border border-line rounded-2xl p-10 text-center">
          <p className="text-sm text-ink-soft">No products in this view yet. Check back soon.</p>
        </div>
      )}

      <div className="space-y-6">
        {filtered.map((product, i) => {
          const analytics = product.analytics;
          const hasReviews = !!analytics && analytics.totalReviews > 0;
          const isLaunched = product.launchStatus === 'Launched';

          return (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i, 6) * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-surface border border-line rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Post header — brand identity row, like an account line on a feed post */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-ledger-soft text-ledger font-display font-semibold text-xs flex items-center justify-center">
                    {creatorInitials(product.creatorId)}
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-ink">{product.title}</p>
                    <p className="text-[11px] text-ink-faint">
                      {product.category || 'Product listing'}
                    </p>
                  </div>
                </div>

                <span
                  className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    isLaunched
                      ? 'bg-verified-soft text-verified'
                      : 'bg-pending-soft text-pending'
                  }`}
                >
                  {isLaunched ? <CheckCircle2 className="w-3 h-3" /> : <Clock3 className="w-3 h-3" />}
                  {product.launchStatus}
                </span>
              </div>

              {/* Big feed-style image */}
              <div className="w-full aspect-[4/3] bg-surface-sunken">
                <img
                  src={product.catalogImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Caption block */}
              <div className="px-5 pt-4 pb-2 space-y-1.5">
                <p className="text-sm text-ink leading-relaxed">{product.description}</p>
              </div>

              {/* Stats row — styled like a data ledger line, mono numerals */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-line mt-2">
                <div className="flex items-center gap-4 font-data text-xs text-ink-soft">
                  <span>
                    <span className="text-ink font-medium">{hasReviews ? analytics!.totalReviews : 0}</span> reviews
                  </span>
                  {hasReviews && (
                    <span className="flex items-center gap-1.5">
                      <span className="signal-pulse text-signal">
                        <span></span><span></span><span></span>
                      </span>
                      <span className="text-ink font-medium">{analytics!.sentimentScore.toFixed(0)}%</span> signal
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    onSelectProduct(product);
                    onNavigate('review-form');
                  }}
                  className="bg-signal hover:bg-signal-hover text-white text-xs font-semibold py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Review this product
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
};
