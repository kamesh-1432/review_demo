import React from 'react';
import { MessageSquare } from 'lucide-react';
import type { Product, CurrentPage } from '../types';

interface ReviewerDashboardProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: CurrentPage) => void;
}

export const ReviewerDashboard: React.FC<ReviewerDashboardProps> = ({ 
  products, 
  onSelectProduct, 
  onNavigate 
}) => {
  // Defensive guard against non-array payloads
  const productList = Array.isArray(products) ? products : [];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5 space-y-1">
        <h2 className="text-xl font-bold text-slate-900">Active Procurement Evaluation Catalog</h2>
        <p className="text-xs text-slate-500">Select any active or pending release item to execute deep metric analysis reviews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productList.map((product) => (
          <div key={product.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="h-44 relative bg-slate-100">
                <img src={product.catalogImage} alt={product.title} className="w-full h-full object-cover" />
                <span className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  product.launchStatus === 'Launched' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {product.launchStatus}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-base text-slate-900 line-clamp-1">{product.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{product.description}</p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button 
                onClick={() => {
                  onSelectProduct(product);
                  onNavigate('review-form');
                }} 
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Review the Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};