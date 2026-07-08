import React, { useState } from 'react';
import { PlusCircle, BarChart3 } from 'lucide-react';
import type { Product, CurrentPage } from '../types';

interface CreatorDashboardProps {
  products: Product[];
  onNavigate: (page: CurrentPage) => void;
  onSelectProduct: (product: Product) => void;
  onLaunchProduct: (title: string, desc: string, status: 'Launched' | 'Upcoming') => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ 
  products, 
  onNavigate, 
  onSelectProduct, 
  onLaunchProduct 
}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState<'Launched' | 'Upcoming'>('Launched');

  // Defensive array fallback checking
  const productList = Array.isArray(products) ? products : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;
    onLaunchProduct(title, desc, status);
    setTitle('');
    setDesc('');
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Launch Panel */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-blue-600" /> Provision New Asset
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Asset Title Name</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. HyperDrive Array v4" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Specifications Overview</label>
              <textarea required rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Provide design details..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 resize-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Registry Mode</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                <option value="Launched">Launched (Evaluations Open)</option>
                <option value="Upcoming">Upcoming (Beta Sandbox Pool)</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl cursor-pointer">
              Execute Integration
            </button>
          </form>
        </div>

        {/* Catalog List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-base text-slate-900">Your Deployed Asset Index</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productList.map((product) => (
              <div key={product.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
                <div className="flex gap-3 items-start">
                  <img src={product.catalogImage} className="w-12 h-12 rounded-lg object-cover border border-slate-100" alt="" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{product.title}</h4>
                    <span className={`inline-block text-[9px] font-mono px-2 py-0.2 rounded mt-1 border ${
                      product.launchStatus === 'Launched' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {product.launchStatus}
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">{product.analytics?.totalReviews || 0} records logged</span>
                  <button 
                    onClick={() => {
                      onSelectProduct(product);
                      onNavigate('creator-analytics');
                    }} 
                    className="text-xs text-blue-600 font-semibold flex items-center gap-0.5 hover:text-blue-700 cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> View Analytics →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
