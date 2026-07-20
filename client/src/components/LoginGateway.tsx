import React, { useState } from 'react';
import { ArrowLeft, UserPlus, LogIn, Mail, Lock } from 'lucide-react';
import type { UserRole, CurrentPage } from '../types';

interface LoginGatewayProps {
  userRole: UserRole | null;
  isRegistering: boolean;
  setIsRegistering: (registering: boolean) => void;
  onNavigate: (page: CurrentPage) => void;
  onSubmit: (email: string, pass: string) => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  userRole,
  isRegistering,
  setIsRegistering,
  onNavigate,
  onSubmit
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <button
        onClick={() => onNavigate('landing')}
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-surface border border-line rounded-2xl p-8 md:p-10 shadow-sm space-y-7">
        <div className="space-y-2 text-center">
          <div className="w-11 h-11 rounded-xl bg-ledger-soft text-ledger flex items-center justify-center mx-auto mb-3">
            {isRegistering ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
          </div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            {isRegistering ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-ink-soft">
            {isRegistering ? 'Signing up' : 'Signing in'} as a{' '}
            <span className="text-ledger font-semibold capitalize">{userRole}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-faint absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface-sunken border border-line rounded-xl pl-11 pr-4 py-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ledger/30 focus:border-ledger transition-shadow"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-faint absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-sunken border border-line rounded-xl pl-11 pr-4 py-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ledger/30 focus:border-ledger transition-shadow"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-ledger hover:bg-ledger-hover text-white text-sm font-semibold py-3.5 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isRegistering ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {isRegistering ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="text-center pt-1 border-t border-line">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-ink-soft hover:text-ledger mt-5 cursor-pointer"
          >
            {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};