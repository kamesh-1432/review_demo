import React from 'react';
import { Layers } from 'lucide-react';
import type { CurrentPage } from '../types';

interface HeaderProps {
  currentPage: CurrentPage;
  onNavigate: (page: CurrentPage) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          onClick={() => onNavigate('landing')}
        >
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm shadow-blue-600/10">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900">
              Review<span className="text-blue-600 font-semibold">Insight</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {currentPage !== 'landing' && currentPage !== 'login' && (
            <button 
              onClick={onLogout}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 bg-white px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
            >
              Log Out Session
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
