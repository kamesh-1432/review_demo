import React, { useState } from 'react';
import { ArrowLeft, UserPlus, LogIn } from 'lucide-react';
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
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        <button 
          onClick={() => onNavigate('landing')} 
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 border border-slate-100 bg-slate-50 px-2 py-1 rounded cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </button>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900">
            {isRegistering ? 'Create Authorization Space' : 'Secure Vault Authentication'}
          </h2>
          <p className="text-xs text-slate-500">
            Accessing configuration routing matrix as a <span className="text-blue-600 font-semibold capitalize">{userRole}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Corporate Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@enterprise.com" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Security Signature Key</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••••••" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isRegistering ? <UserPlus className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
            {isRegistering ? 'Register Secure Identity' : 'Establish Authenticated Session'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-xs text-slate-500 hover:text-blue-600 underline cursor-pointer">
            {isRegistering ? 'Already have credentials? Access vault here' : 'Need corporate registration? Provision space here'}
          </button>
        </div>
      </div>
    </div>
  );
};
