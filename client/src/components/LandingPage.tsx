import React from 'react';
import { Sparkles, ShieldCheck, ChevronRight, Code } from 'lucide-react';
import type { UserRole, CurrentPage } from '../types';

interface LandingPageProps {
  onRoleSelect: (role: UserRole) => void;
  onNavigate: (page: CurrentPage) => void;
  setIsRegistering: (registering: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onRoleSelect, onNavigate, setIsRegistering }) => {
  const selectRole = (role: UserRole) => {
    onRoleSelect(role);
    setIsRegistering(false);
    onNavigate('login');
  };

  return (
    <div className="space-y-16 py-8">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-semibold px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3" /> Enterprise Product Lifecycle Infrastructure
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Bridge the validation gap between <span className="text-blue-600">Product Creators</span> and expert audiences.
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A unified verification architecture. Launch enterprise products, harvest natural language feedback streams, and process deep transformer aspect metrics instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Reviewer Entry */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center border border-blue-100">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Become a Certified Reviewer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Access premium pre-launch assets. Evaluate hardware, software, and industrial designs. Log granular semantic indicators through deep language model evaluation grids.
            </p>
          </div>
          <button 
            onClick={() => selectRole('reviewer')}
            className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Enter Reviewer Portal <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Creator Entry */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center border border-indigo-100">
              <Code className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Deploy as a Product Creator</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              List upcoming system solutions, generate digital catalogs, and view deep natural language processed (NLP) customer sentiment curves inside custom dashboard matrices.
            </p>
          </div>
          <button 
            onClick={() => selectRole('creator')}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/10 cursor-pointer"
          >
            Enter Creator Console <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
