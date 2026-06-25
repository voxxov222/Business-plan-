import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getEngagementState, 
  calculateSentiment, 
  EngagementState, 
  SentimentLevel,
  resetEngagement 
} from '../lib/engagement';
import { 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  RotateCcw,
  Zap
} from 'lucide-react';

interface InvestorSentimentProps {
  variant?: 'compact' | 'full';
}

export const InvestorSentiment: React.FC<InvestorSentimentProps> = ({ variant = 'full' }) => {
  const [state, setState] = useState<EngagementState>(getEngagementState());

  useEffect(() => {
    const handleUpdate = () => {
      setState(getEngagementState());
    };
    window.addEventListener('safemart_engagement_updated', handleUpdate);
    return () => {
      window.removeEventListener('safemart_engagement_updated', handleUpdate);
    };
  }, []);

  const sentiment = calculateSentiment(state);

  // Define checklists to show progress
  const checklist = [
    { id: 'specs', label: 'Inspect Safe-Window Technical Specs', done: state.viewedSpecs },
    { id: 'sim-open', label: 'Initialize Walk-up Lockdown Sim', done: state.viewedSim },
    { 
      id: 'sim-stages', 
      label: `Test Lockdown Sim Stages (${state.simSteps.length}/4 tested)`, 
      done: state.simSteps.length >= 4,
      sublabel: 'Try Stage 1, Stage 2, Stage 3, and Stage 4 in the interactive simulator'
    },
    { 
      id: '3d-parts', 
      label: `Inspect 3D Portal Architecture (${state.inspectedComponents.length}/5 viewed)`, 
      done: state.inspectedComponents.length >= 5,
      sublabel: 'Click the parts of the 3D window assembly (Ballistic Shield, Frame, Tray, etc.)'
    },
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 px-4 py-2 border ${sentiment.borderClass} ${sentiment.bgClass} ${sentiment.glowClass} transition-all duration-500 rounded-none`}>
        <div className="relative flex items-center justify-center">
          {/* Dynamic pulsing glow indicator */}
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              sentiment.score >= 85 ? 'bg-emerald-400' : sentiment.score >= 50 ? 'bg-sky-400' : sentiment.score >= 15 ? 'bg-amber-400' : 'bg-red-500'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              sentiment.score >= 85 ? 'bg-emerald-400' : sentiment.score >= 50 ? 'bg-sky-400' : sentiment.score >= 15 ? 'bg-amber-400' : 'bg-red-500'
            }`}></span>
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono font-bold">Investor Sentiment:</span>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${sentiment.color} flex items-center gap-1`}>
              {sentiment.emoji} {sentiment.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {/* Miniature progress bar */}
            <div className="w-24 bg-zinc-800 h-1 rounded-none overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ${
                  sentiment.score >= 85 ? 'bg-emerald-400' : sentiment.score >= 50 ? 'bg-sky-400' : sentiment.score >= 15 ? 'bg-amber-400' : 'bg-red-500'
                }`}
                style={{ width: `${sentiment.score}%` }}
              />
            </div>
            <span className="text-[9px] font-mono font-bold text-white">{sentiment.score}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border ${sentiment.borderClass} ${sentiment.bgClass} p-8 sm:p-10 transition-all duration-500 relative overflow-hidden`}>
      {/* Decorative vector background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-white/[0.02] to-transparent pointer-events-none" />
      
      {/* Dynamic watermarked emoji */}
      <div className="absolute -bottom-8 -right-8 text-[120px] opacity-5 pointer-events-none select-none">
        {sentiment.emoji}
      </div>

      <div className="flex flex-col xl:flex-row gap-8 justify-between items-start relative z-10">
        {/* Left Sentiment Gauge & Score */}
        <div className="w-full xl:w-5/12 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.3em] uppercase text-sky-400 font-bold block">Gamified Underwriting</span>
            <h3 className="text-3xl font-light text-white tracking-tighter flex items-center gap-2.5">
              Investor <span className="font-serif italic text-sky-400">Sentiment Engine</span>
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            ATB commercial loan underwriters and private equity partners evaluate interactive engagements. Fulfill the safety-auditing tasks below to lock in the optimal sentiment commitment, unlocking <strong>100% funding approval probability</strong>.
          </p>

          <div className="flex items-center gap-5 p-4 bg-black/60 border border-white/5">
            <div className="relative shrink-0 flex items-center justify-center w-20 h-20">
              {/* Radial Score Gauge */}
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#121215"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke={sentiment.score >= 85 ? '#10b981' : sentiment.score >= 50 ? '#38bdf8' : sentiment.score >= 15 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - sentiment.score / 100)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-mono font-bold text-white">{sentiment.score}%</span>
                <span className="text-[8px] uppercase tracking-wider text-slate-500 font-mono">Score</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500">Current Standing</span>
              <h4 className={`text-lg font-serif italic ${sentiment.color} flex items-center gap-1.5`}>
                {sentiment.emoji} {sentiment.label}
              </h4>
              <p className="text-[11px] text-slate-300 leading-normal">
                {sentiment.description}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetEngagement}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-white/20 text-[9px] font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-all bg-zinc-950/40 hover:bg-zinc-950"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Engagement
            </button>
            
            <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500">
              <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
              Real-time synchronization active
            </div>
          </div>
        </div>

        {/* Right Audit Checklist */}
        <div className="w-full xl:w-7/12 space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-slate-200 font-bold flex items-center gap-2 border-b border-white/5 pb-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            Security Auditing Milestones
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {checklist.map((item) => (
              <div
                key={item.id}
                className={`p-4 border transition-all duration-300 ${
                  item.done 
                    ? 'border-emerald-500/25 bg-emerald-500/5' 
                    : 'border-white/5 bg-black/45 hover:border-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {item.done ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                    ) : (
                      <Circle className="w-4.5 h-4.5 text-slate-600" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className={`text-xs font-bold block ${item.done ? 'text-white' : 'text-slate-400'}`}>
                      {item.label}
                    </span>
                    {item.sublabel && (
                      <p className="text-[10px] text-slate-500 leading-normal">
                        {item.sublabel}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Gamified Sentiment Status Card */}
          <div className="bg-black/40 border border-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Funding Assurance Index:
              </span>
            </div>
            <span className={`font-mono font-bold text-xs ${
              sentiment.score >= 85 ? 'text-emerald-400' : sentiment.score >= 50 ? 'text-sky-400' : 'text-amber-400'
            }`}>
              {sentiment.score >= 85 ? 'HIGHLY APPROVED (OPTIMAL RATES)' : 'PENDING SECURITY COMPLIANCE'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
