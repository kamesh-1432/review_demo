import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Rocket, BarChart3, Package, Sparkle, ImagePlus, X } from 'lucide-react';
import type { Product, CurrentPage } from '../types';

interface CreatorDashboardProps {
  products: Product[];
  onNavigate: (page: CurrentPage) => void;
  onSelectProduct: (product: Product) => void;
  onLaunchProduct: (
    title: string,
    desc: string,
    status: 'Launched' | 'Upcoming',
    catalogImage: string,
    price: number,
    category: string
  ) => void;
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB raw file cap, keeps base64 payload safely under the 8mb server limit

const CATEGORY_OPTIONS = [
  'Electronics',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Apparel & Accessories',
  'Sports & Outdoors',
  'Software & Apps',
  'Toys & Games',
  'Other'
];

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  products,
  onNavigate,
  onSelectProduct,
  onLaunchProduct
}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState<'Launched' | 'Upcoming'>('Launched');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productList = Array.isArray(products) ? products : [];

  const handleFileSelect = (file: File | undefined) => {
    setImageError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('Image is too large — please choose one under 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result as string);
    reader.onerror = () => setImageError('Could not read that file, please try another.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !desc.trim()) return;

    if (!imageData) {
      setImageError('Add a catalog image before listing the product.');
      return;
    }

    if (!category) {
      setFormError('Choose a category so reviewers can find this product.');
      return;
    }

    const numericPrice = Number(price);
    if (!price || Number.isNaN(numericPrice) || numericPrice <= 0) {
      setFormError('Enter a real price greater than $0 — this is shown to reviewers and buyers.');
      return;
    }

    onLaunchProduct(title, desc, status, imageData, numericPrice, category);
    setTitle('');
    setDesc('');
    setPrice('');
    setCategory('');
    setImageData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">Creator console</h2>
        <p className="text-sm text-ink-soft mt-1">List a product and track its signal as reviews come in.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-surface border border-line rounded-2xl p-7 md:p-8 shadow-sm h-fit space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-ledger-soft text-ledger w-9 h-9 rounded-xl flex items-center justify-center">
              <Rocket className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-display font-semibold text-lg text-ink">List a new product</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Catalog image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
                className="hidden"
                id="catalog-image-input"
              />

              {imageData ? (
                <div className="relative rounded-xl overflow-hidden border border-line group">
                  <img src={imageData} alt="Selected catalog preview" className="w-full aspect-video object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageData(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 bg-ink/70 hover:bg-ink text-white rounded-full p-1.5 cursor-pointer transition-colors"
                    aria-label="Remove selected image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="catalog-image-input"
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line rounded-xl aspect-video cursor-pointer bg-surface-sunken hover:border-ledger hover:bg-ledger-soft/40 transition-colors"
                >
                  <ImagePlus className="w-6 h-6 text-ink-faint" />
                  <span className="text-sm text-ink-soft font-medium">Click to choose an image</span>
                  <span className="text-xs text-ink-faint">PNG or JPG, up to 4MB</span>
                </label>
              )}
              {imageError && <p className="text-xs text-flag font-medium">{imageError}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Product name</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. HyperDrive Array v4"
                className="w-full bg-surface-sunken border border-line rounded-xl px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ledger/30 focus:border-ledger transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Description</label>
              <textarea
                required
                rows={5}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="What is it, who's it for, and what should reviewers pay attention to?"
                className="w-full bg-surface-sunken border border-line rounded-xl p-4 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ledger/30 focus:border-ledger transition-shadow resize-none leading-relaxed"
              />
              <p className="text-xs text-ink-faint">{desc.length} characters — a few clear sentences work better than a spec sheet.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint text-[15px]">$</span>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="49.99"
                    className="w-full bg-surface-sunken border border-line rounded-xl pl-7 pr-4 py-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ledger/30 focus:border-ledger transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Category</label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-sunken border border-line rounded-xl px-4 py-3.5 text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-ledger/30 focus:border-ledger transition-shadow"
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Availability</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('Launched')}
                  className={`text-sm font-semibold py-3.5 rounded-xl border transition-colors cursor-pointer ${
                    status === 'Launched'
                      ? 'bg-verified-soft border-verified text-verified'
                      : 'bg-surface-sunken border-line text-ink-soft hover:border-ink-faint'
                  }`}
                >
                  Launched
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('Upcoming')}
                  className={`text-sm font-semibold py-3.5 rounded-xl border transition-colors cursor-pointer ${
                    status === 'Upcoming'
                      ? 'bg-pending-soft border-pending text-pending'
                      : 'bg-surface-sunken border-line text-ink-soft hover:border-ink-faint'
                  }`}
                >
                  Upcoming
                </button>
              </div>
              <p className="text-xs text-ink-faint">
                {status === 'Launched' ? 'Open for reviews right away.' : 'Visible to reviewers, but not open for review yet.'}
              </p>
            </div>

            {formError && <p className="text-xs text-flag font-medium">{formError}</p>}

            <button
              type="submit"
              className="w-full bg-signal hover:bg-signal-hover text-white text-sm font-semibold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkle className="w-4 h-4" /> List product
            </button>
          </form>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-ink">Your products</h3>
            <span className="text-xs font-data text-ink-faint">{productList.length} listed</span>
          </div>

          {productList.length === 0 && (
            <div className="bg-surface border border-line rounded-2xl p-12 text-center flex flex-col items-center gap-3">
              <div className="bg-surface-sunken w-12 h-12 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-ink-faint" />
              </div>
              <p className="text-sm text-ink-soft">Nothing listed yet — use the form to add your first product.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {productList.map((product, i) => {
              const isLaunched = (product.launchStatus ?? 'Launched') === 'Launched';
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i, 6) * 0.04 }}
                  whileHover={{ y: -3 }}
                  className="bg-surface border border-line rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="w-full aspect-[16/10] bg-surface-sunken">
                    <img
                      src={product.catalogImage}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display font-semibold text-base text-ink leading-snug">{product.title}</h4>
                      <span
                        className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          isLaunched ? 'bg-verified-soft text-verified' : 'bg-pending-soft text-pending'
                        }`}
                      >
                        {isLaunched ? 'Launched' : 'Upcoming'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-data font-semibold text-ink">
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                      </span>
                      {product.category && (
                        <span className="text-ink-faint">· {product.category}</span>
                      )}
                    </div>
                    <p className="text-sm text-ink-soft leading-relaxed line-clamp-2">{product.description}</p>

                    <div className="mt-auto pt-3 border-t border-line flex items-center justify-between">
                      <span className="text-xs font-data text-ink-soft">
                        <span className="text-ink font-medium">{product.analytics?.totalReviews ?? 0}</span> reviews
                      </span>
                      <button
                        onClick={() => {
                          onSelectProduct(product);
                          onNavigate('creator-analytics');
                        }}
                        className="text-xs font-semibold text-ledger hover:text-ledger-hover flex items-center gap-1 cursor-pointer"
                      >
                        <BarChart3 className="w-3.5 h-3.5" /> Analytics
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};