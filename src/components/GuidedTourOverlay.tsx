import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Play, 
  HelpCircle, 
  ShieldCheck, 
  Coins, 
  TrendingUp, 
  Compass,
  ArrowRight,
  MousePointerClick
} from 'lucide-react';

interface TourStep {
  targetId: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  valueProp: string;
  metrics: { label: string; value: string; color: string }[];
  icon: React.ReactNode;
}

export const GuidedTourOverlay = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showTeaser, setShowTeaser] = useState<boolean>(true);

  const steps: TourStep[] = [
    {
      targetId: 'hero-revenue-projection',
      title: 'A Safer, Smarter Convenience Model',
      subtitle: 'Premium Location & Stable Projections',
      badge: 'PROVEN SOUTHSIDE GEOGRAPHY',
      description: 'SafeMart revitalizes a highly lucrative, historically proven retail storefront in South Edmonton. By blending stable, daily essential goods with high-margin coffee and parcel services, we mitigate the standard risks of startup convenience operations.',
      valueProp: 'A high-traffic, commuter-dense Mill Woods location optimized to capture both standard daytime neighborhood retail and late-night health-corridor traffic from the nearby Grey Nuns Hospital.',
      metrics: [
        { label: '3-Year Profit Target', value: '$350,000', color: 'text-sky-400' },
        { label: 'Startup Capital Injection', value: '$50,000 Cash', color: 'text-emerald-400' },
        { label: 'Revenue Growth CAGR', value: '18.4%', color: 'text-amber-400' }
      ],
      icon: <TrendingUp className="w-5 h-5 text-sky-400" />
    },
    {
      targetId: 'ai-planning-studio',
      title: 'Interactive AI Planning Studio',
      subtitle: 'Dynamic Underwriting & Scenario Sandbox',
      badge: 'ACTIVE COLLABORATIVE MATRIX',
      description: 'Lenders and investors can stress-test operating variables in real-time. Slide parameters like store square-footage, net lease rates, or hourly wages to see how they dynamically update our Debt Service Coverage Ratio (DSCR) and cumulative Loan Approval rating.',
      valueProp: 'Demonstrates extreme financial discipline. By allowing banks to run real-time sensitivity tests, we pre-empt underwriting concerns and establish immediate credibility.',
      metrics: [
        { label: 'Underwriter Rating', value: 'Dynamic Score', color: 'text-indigo-400' },
        { label: 'DSCR Target Ratio', value: '1.25x - 1.50x', color: 'text-emerald-400' },
        { label: 'Sensitivity Scenarios', value: '3-Tier Sandbox', color: 'text-sky-400' }
      ],
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />
    },
    {
      targetId: 'security-architecture-section',
      title: 'Hermetic Late-Night Safe-Window',
      subtitle: 'Biometric & Ballistic Hazard Reduction',
      badge: 'UL-752 MILITARY SPEC PROTECTION',
      description: 'To solve overnight staff liabilities and secure a 30% discount on commercial insurance, SafeMart locks the lobby doors after 10:00 PM. All commerce shifts to the Safe-Window, protected by Level 3 ballistic acrylic and automated FLIR threat scanners.',
      valueProp: 'Ensures 24/7 revenue uptime with absolute threat isolation. Shoplifting and armed assault vectors are reduced to virtual zero, creating an exceptionally stable workplace.',
      metrics: [
        { label: 'Overnight Shrinkage', value: '< 0.25%', color: 'text-emerald-400' },
        { label: 'Ballistic Protection', value: 'UL-752 Level 3', color: 'text-rose-400' },
        { label: 'Actuation Speed', value: '400ms Lockdown', color: 'text-amber-400' }
      ],
      icon: <ShieldCheck className="w-5 h-5 text-rose-400" />
    },
    {
      targetId: 'loan-readiness-section',
      title: 'Bank Loan Underwriting Portal',
      subtitle: 'Rigorous Credit & Capital Suitability',
      badge: 'BDC & ATB ALIGNED PRO-FORMA',
      description: 'Review our credit score diagnostics, loan amortization schedules, and risk mitigation criteria. This dashboard maps how the $150,000 commercial credit request is fully backed by personal guarantees, tangible security assets, and stable debt service capacity.',
      valueProp: 'A transparent, bank-ready credit framework that guarantees investor equity occupies a senior, highly protected position within the capital structure.',
      metrics: [
        { label: 'Credit Alignment Score', value: '98/100 Perfect', color: 'text-sky-400' },
        { label: 'Asset Collateralization', value: '120% LTV Backed', color: 'text-emerald-400' },
        { label: 'Amortization Horizon', value: '10 Years (ATB Standard)', color: 'text-amber-400' }
      ],
      icon: <Coins className="w-5 h-5 text-amber-400" />
    }
  ];

  // Start the tour
  const startTour = () => {
    setIsActive(true);
    setCurrentStepIndex(0);
    setShowTeaser(false);
    scrollToTarget('hero-revenue-projection');
  };

  useEffect(() => {
    const handleStartTour = () => {
      startTour();
    };
    window.addEventListener('start-guided-tour', handleStartTour);
    return () => {
      window.removeEventListener('start-guided-tour', handleStartTour);
    };
  }, []);

  // Close the tour
  const closeTour = () => {
    setIsActive(false);
    // Remove highlight border styling from all sections
    steps.forEach(step => {
      const el = document.getElementById(step.targetId);
      if (el) {
        el.classList.remove('tour-highlighted');
      }
    });
  };

  // Safe scrolling mechanism with custom fallback and high-contrast styling triggers
  const scrollToTarget = (id: string) => {
    // Clear previous highlights
    steps.forEach(step => {
      const el = document.getElementById(step.targetId);
      if (el) {
        el.classList.remove('tour-highlighted');
      }
    });

    const targetElement = document.getElementById(id);
    if (targetElement) {
      // Add custom highlight borders / pulses
      targetElement.classList.add('tour-highlighted');

      // Smooth scroll
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Step change
  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      scrollToTarget(steps[nextIndex].targetId);
    } else {
      closeTour();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      scrollToTarget(steps[prevIndex].targetId);
    }
  };

  // Add styles dynamically on load to index.css or render style tag
  return (
    <>
      {/* Dynamic style injection for high contrast highlights and overlays */}
      <style>{`
        .tour-highlighted {
          outline: 3px solid rgba(56, 189, 248, 0.9) !important;
          outline-offset: 4px !important;
          box-shadow: 0 0 50px rgba(56, 189, 248, 0.25) !important;
          transition: all 0.5s ease-in-out !important;
          position: relative !important;
          z-index: 40 !important;
        }
      `}</style>

      {/* Floating Tour Teaser Banner */}
      <AnimatePresence>
        {showTeaser && !isActive && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-xl bg-zinc-950 border border-sky-500/30 p-4 shadow-[0_15px_50px_rgba(56,189,248,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-400/10 text-sky-400 shrink-0">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono uppercase text-sky-400 tracking-wider font-bold">PROSPECTIVE INVESTOR DECK</span>
                <p className="text-xs text-white font-bold font-sans">Would you like a guided walk-through of SafeMart's value proposal?</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button 
                onClick={() => setShowTeaser(false)}
                className="px-3 py-1.5 text-[10px] text-slate-400 hover:text-white font-mono uppercase"
              >
                Skip
              </button>
              <button 
                onClick={startTour}
                className="px-4 py-2 bg-sky-400 hover:bg-sky-300 text-black text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Tour
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Guided Tour Controls Overlay Panel */}
      <AnimatePresence>
        {isActive && (
          <>
            {/* Backdrop Dimmer Overlay except highlighted elements */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={closeTour}
              className="fixed inset-0 bg-black z-40 pointer-events-none"
            />

            {/* Bottom Floating Interactive Controller Card */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-8 right-8 z-50 w-[95%] max-w-lg bg-[#050508] border-2 border-sky-400 p-6 sm:p-8 shadow-[0_25px_60px_rgba(56,189,248,0.25)]"
            >
              <div className="space-y-6">
                {/* Controller Header */}
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase text-sky-400 tracking-widest font-bold bg-sky-500/10 px-2 py-0.5 border border-sky-500/20">
                      {steps[currentStepIndex].badge}
                    </span>
                    <h3 className="text-xl font-light text-white tracking-tight mt-1 flex items-center gap-2">
                      {steps[currentStepIndex].icon}
                      {steps[currentStepIndex].title}
                    </h3>
                    <p className="text-xs font-serif italic text-slate-400">{steps[currentStepIndex].subtitle}</p>
                  </div>
                  <button 
                    onClick={closeTour}
                    className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main description copy */}
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {steps[currentStepIndex].description}
                  </p>
                  <div className="bg-sky-500/5 p-3.5 border-l-2 border-sky-400 text-xs text-slate-300 italic leading-relaxed">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-sky-400 font-bold block mb-1">THE VALUE PROPOSITION:</span>
                    "{steps[currentStepIndex].valueProp}"
                  </div>
                </div>

                {/* Key Metrics row */}
                <div className="grid grid-cols-3 gap-3 bg-black/60 p-4 border border-white/5 font-mono">
                  {steps[currentStepIndex].metrics.map((m, idx) => (
                    <div key={idx} className="space-y-1 text-center">
                      <span className="text-[8px] uppercase text-slate-500 block">{m.label}</span>
                      <span className={`text-[12px] sm:text-xs font-bold block ${m.color}`}>{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Navigation and progression */}
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <div className="text-[10px] font-mono text-slate-500">
                    Step <span className="text-white font-bold">{currentStepIndex + 1}</span> of <span className="text-slate-400">{steps.length}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStepIndex === 0}
                      className="p-2 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all cursor-pointer flex items-center justify-center"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-4 py-2 bg-sky-400 hover:bg-sky-300 text-black font-mono font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>{currentStepIndex === steps.length - 1 ? 'Finish Tour' : 'Next Section'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
