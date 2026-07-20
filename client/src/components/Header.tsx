import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { CurrentPage } from '../types';

interface HeaderProps {
  currentPage: CurrentPage;
  onNavigate: (page: CurrentPage) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const showLogout = currentPage !== 'landing' && currentPage !== 'login';

  return (
    <header className="bg-surface/90 backdrop-blur-md border-b border-line sticky top-0 z-50 px-5 md:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          onClick={() => onNavigate('landing')}
        >
          <div className="bg-ledger text-signal-soft p-2 rounded-lg shadow-sm group-hover:bg-ledger-hover transition-colors">
            <span className="signal-pulse text-[#FFE9E1]">
              <span></span><span></span><span></span>
            </span>
          </div>
          <span className="font-display font-semibold text-[17px] tracking-tight text-ink">
            Review<span className="text-ledger">Insight</span>
          </span>
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-4">
          {showLogout && (
            <button
              onClick={onLogout}
              className="text-xs font-medium text-ink-soft hover:text-ink transition-colors border border-line bg-surface px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
            >
              Log out
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        {showLogout && (
          <button
            className="sm:hidden p-2 -mr-2 text-ink-soft"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Mobile menu panel */}
      {showLogout && mobileOpen && (
        <div className="sm:hidden max-w-6xl mx-auto pt-3 mt-3 border-t border-line">
          <button
            onClick={() => { onLogout(); setMobileOpen(false); }}
            className="w-full text-left text-xs font-medium text-ink-soft hover:text-ink transition-colors border border-line bg-surface px-3 py-2 rounded-lg cursor-pointer"
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
};
