import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight, Rocket, PenLine, LineChart, Radar } from 'lucide-react';
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

  const steps = [
    { icon: Rocket, label: 'List it', copy: 'Creators publish a product in under a minute.' },
    { icon: PenLine, label: 'Get reviewed', copy: 'Reviewers evaluate it and leave real, written feedback.' },
    { icon: Radar, label: 'Read the signal', copy: 'Feedback is scored across sentiment and product aspects.' },
  ];

  return (
    <div className="space-y-24 py-6">
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-7"
        >
          <div className="inline-flex items-center gap-2 bg-ledger-soft text-ledger text-xs font-semibold px-3.5 py-1.5 rounded-full">
            <span className="signal-pulse"><span></span><span></span><span></span></span>
            Turn reviews into signal
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-ink leading-[1.1]">
            Where creators launch, and reviewers make it credible.
          </h1>
          <p className="text-base text-ink-soft max-w-lg leading-relaxed">
            List a product, get evaluated by real reviewers, and watch written feedback turn into a
            clear sentiment and aspect signal — no spreadsheets, no guesswork.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => selectRole('creator')}
              className="bg-signal hover:bg-signal-hover text-white text-sm font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              Start as a creator <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => selectRole('reviewer')}
              className="bg-surface hover:bg-surface-sunken text-ink text-sm font-semibold py-3 px-6 rounded-xl border border-line transition-colors cursor-pointer"
            >
              Start as a reviewer
            </button>
          </div>
        </motion.div>

        {/* Visual panel — a stylized mock of the product's own review card + signal readout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-ledger/5 rounded-[2rem] -z-10" />
          <div className="bg-surface border border-line rounded-2xl shadow-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-ledger-soft text-ledger font-display font-semibold text-[11px] flex items-center justify-center">AV</div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-ink">Aperture V2</p>
                  <p className="text-[11px] text-ink-faint">Consumer hardware</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-verified-soft text-verified">Launched</span>
            </div>

            <div className="bg-surface-sunken rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-soft flex items-center gap-1.5">
                  <LineChart className="w-3.5 h-3.5" /> Sentiment signal
                </span>
                <span className="font-data text-sm font-semibold text-ledger">86%</span>
              </div>
              <div className="h-2 rounded-full bg-line overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '86%' }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="h-full bg-ledger rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Quality', v: 92 },
                { label: 'Value', v: 74 },
                { label: 'Support', v: 81 },
              ].map((a) => (
                <div key={a.label} className="bg-surface-sunken rounded-xl p-3 text-center space-y-1">
                  <p className="font-data text-base font-semibold text-ink">{a.v}</p>
                  <p className="text-[10px] text-ink-faint uppercase tracking-wide">{a.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-ink-faint pt-1">
              <span className="signal-pulse text-signal"><span></span><span></span><span></span></span>
              14 new reviews processed this week
            </div>
          </div>
        </motion.div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="bg-surface border border-line rounded-2xl p-6 space-y-3"
            >
              <div className="w-9 h-9 rounded-lg bg-ledger-soft text-ledger flex items-center justify-center font-data text-xs font-semibold">
                0{i + 1}
              </div>
              <h4 className="font-display font-semibold text-sm text-ink">{s.label}</h4>
              <p className="text-xs text-ink-soft leading-relaxed">{s.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Role selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-surface border border-line p-8 rounded-2xl shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md"
        >
          <div className="space-y-4">
            <div className="bg-ledger-soft w-12 h-12 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-ledger" />
            </div>
            <h3 className="font-display text-lg font-semibold text-ink">Become a reviewer</h3>
            <p className="text-sm text-ink-soft leading-relaxed">
              Get early access to products before launch. Write honest reviews and help shape what
              ships next.
            </p>
          </div>
          <button
            onClick={() => selectRole('reviewer')}
            className="mt-8 w-full bg-ink hover:bg-ink/90 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Enter reviewer portal <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-surface border border-line p-8 rounded-2xl shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md"
        >
          <div className="space-y-4">
            <div className="bg-signal-soft w-12 h-12 rounded-xl flex items-center justify-center">
              <Rocket className="w-5 h-5 text-signal" />
            </div>
            <h3 className="font-display text-lg font-semibold text-ink">Become a creator</h3>
            <p className="text-sm text-ink-soft leading-relaxed">
              List your product, get it in front of real reviewers, and see exactly how it's landing —
              aspect by aspect.
            </p>
          </div>
          <button
            onClick={() => selectRole('creator')}
            className="mt-8 w-full bg-signal hover:bg-signal-hover text-white text-sm font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            Enter creator console <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};