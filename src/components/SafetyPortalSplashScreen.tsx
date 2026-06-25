import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Fingerprint, 
  Lock, 
  Unlock, 
  Thermometer, 
  Play, 
  CheckCircle2, 
  Eye, 
  Zap, 
  ChevronRight,
  RefreshCw,
  X
} from 'lucide-react';

interface SafetyPortalSplashScreenProps {
  onComplete?: () => void;
}

export const SafetyPortalSplashScreen: React.FC<SafetyPortalSplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [scanningCompleted, setScanningCompleted] = useState<boolean>(false);
  const [decision, setDecision] = useState<'pending' | 'clear' | 'lockdown'>('pending');

  const stages = [
    {
      id: 'boot',
      title: 'SYSTEM BOOT & WAKE',
      subtitle: 'Initializing Secure Core',
      description: 'Activating microwave proximity radars, microwave transceivers, and secure cockpit HUD telemetry...',
      icon: <Cpu className="w-5 h-5 text-sky-400" />
    },
    {
      id: 'thermal',
      title: 'FLIR THERMAL SCANNING',
      subtitle: 'Concealed Threat Assessment',
      description: 'Continuous long-wave infrared tracking of approaching customer thermal envelope. Screening for cold metallic voids...',
      icon: <Thermometer className="w-5 h-5 text-orange-400" />
    },
    {
      id: 'biometric',
      title: 'BIOMETRIC FACIAL SECURE MATRIX',
      subtitle: 'Dual-Factor Identity & Stress Analysis',
      description: 'Mapping 3D ocular facial points and tracking micro-capillary iris expansion to measure heart-rate and adrenaline level...',
      icon: <Fingerprint className="w-5 h-5 text-rose-400" />
    },
    {
      id: 'interlock',
      title: 'MECHANICAL DEBRIS LOCKS CHECK',
      subtitle: 'Zero-Contact Cash/Product Handoff',
      description: 'Confirming secure steel deadlock actuation, natural-voice acoustic deflection baffles, and dual-latch package drawer safety...',
      icon: <Lock className="w-5 h-5 text-emerald-400" />
    }
  ];

  // Stage transition timeline simulation
  useEffect(() => {
    if (!isVisible) return;

    // Fast progress simulator
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 45); // Takes ~4.5 seconds to complete full system check

    return () => clearInterval(progressInterval);
  }, [isVisible]);

  // Map progress to stage indices
  useEffect(() => {
    if (progress < 25) {
      setCurrentStage(0);
    } else if (progress < 50) {
      setCurrentStage(1);
    } else if (progress < 75) {
      setCurrentStage(2);
    } else if (progress < 100) {
      setCurrentStage(3);
    } else {
      setScanningCompleted(true);
      // Auto trigger clean passage for the proof of concept after 0.8s
      setTimeout(() => {
        setDecision('clear');
      }, 800);
    }
  }, [progress]);

  // When decision is clear, auto exit after another 1.8 seconds to allow user to see success
  useEffect(() => {
    if (decision === 'clear') {
      const exitTimeout = setTimeout(() => {
        handleDismiss();
      }, 1800);
      return () => clearTimeout(exitTimeout);
    }
  }, [decision]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onComplete) {
      // Small timeout to allow exit animation to complete
      setTimeout(onComplete, 500);
    }
  };

  const simulateLockdown = () => {
    setDecision('lockdown');
  };

  const simulateClear = () => {
    setDecision('clear');
  };

  const restartScan = () => {
    setProgress(0);
    setCurrentStage(0);
    setScanningCompleted(false);
    setDecision('pending');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 bg-[#050505] z-[9999] flex flex-col justify-between p-8 overflow-hidden font-sans select-none"
      >
        {/* Abstract futuristic grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/10 via-transparent to-[#050505] pointer-events-none" />
        
        {/* Top Header Row */}
        <div className="flex justify-between items-center z-10 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-sky-400 flex items-center justify-center bg-sky-400/5 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-sky-400 tracking-widest font-bold">SAFEMART LABS</span>
              <p className="text-xs text-white font-bold tracking-tight">Night-Portal Security Proof of Concept (v1.8)</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Custom live terminal clock indicator */}
            <div className="hidden sm:flex flex-col items-end font-mono text-[9px] text-slate-500">
              <span>SYS_LOC: EDMONTON, AB</span>
              <span>TIME_ZONE: UTC -07:00</span>
            </div>
            
            {/* Bypass Button */}
            <button 
              onClick={handleDismiss}
              className="px-4 py-2 border border-white/10 hover:border-sky-400/50 bg-white/5 text-[9px] font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Bypass System Check</span>
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Central Diagnostics Matrix View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto w-full flex-1 py-6">
          
          {/* Left Column: Visual Hardware Interface & Scanner Feed (Span 6) */}
          <div className="lg:col-span-6 flex flex-col justify-center h-full space-y-4">
            
            <div className="relative border border-white/10 bg-black/65 p-6 shadow-2xl overflow-hidden aspect-video flex flex-col justify-between">
              
              {/* Radar circular animation sweep */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                <div className="w-96 h-96 rounded-full border border-sky-400 animate-ping" style={{ animationDuration: '4s' }} />
                <div className="w-64 h-64 rounded-full border border-sky-400 animate-ping" style={{ animationDuration: '3s' }} />
                <div className="w-32 h-32 rounded-full border border-sky-400 animate-ping" style={{ animationDuration: '2s' }} />
              </div>

              {/* Grid corner decoration items */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/20" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/20" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/20" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/20" />

              {/* Status Bar */}
              <div className="flex justify-between items-center text-[9px] font-mono border-b border-white/5 pb-2">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${decision === 'lockdown' ? 'bg-rose-500 animate-pulse' : 'bg-sky-400 animate-ping'}`} />
                  CAMERA FEED // SEC_COCKPIT_NIGHT
                </span>
                <span className="text-sky-400">FRAME_RATIO: 1.00</span>
              </div>

              {/* Dynamic Interactive HUD Graphic */}
              <div className="flex-1 flex items-center justify-center relative min-h-[160px]">
                
                {/* Overlay Scanning Lasers */}
                {progress > 0 && progress < 100 && (
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }} 
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                    className={`absolute inset-x-0 h-0.5 z-20 ${
                      currentStage === 1 ? 'bg-orange-400/60 shadow-[0_0_10px_rgba(251,146,60,0.6)]' :
                      currentStage === 2 ? 'bg-rose-400/60 shadow-[0_0_10px_rgba(244,63,94,0.6)]' :
                      'bg-sky-400/40 shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                    }`}
                  />
                )}

                {/* Main Visual State Render */}
                <div className="text-center space-y-4">
                  {decision === 'pending' && (
                    <div className="relative">
                      {/* Abstract human layout face mesh vector */}
                      <svg className="w-24 h-24 mx-auto text-slate-700 stroke-1" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                        <circle cx="50" cy="40" r="18" className={currentStage >= 2 ? "text-rose-500/30 stroke-2" : ""} />
                        <path d="M50 58 C 35 58, 25 70, 25 90 L 75 90 C 75 70, 65 58, 50 58 Z" className={currentStage >= 1 ? "text-orange-500/30 stroke-2" : ""} />
                        
                        {/* Eye tracking meshes */}
                        {currentStage >= 2 && (
                          <>
                            <circle cx="45" cy="38" r="1.5" className="fill-rose-400 stroke-none" />
                            <circle cx="55" cy="38" r="1.5" className="fill-rose-400 stroke-none" />
                            <line x1="45" y1="38" x2="55" y2="38" className="stroke-rose-400/50 stroke-[0.5]" />
                            <path d="M40 32 L 60 32" className="stroke-rose-400/50 stroke-[0.5]" />
                          </>
                        )}
                      </svg>

                      {/* Micro telemetries on radar graphics */}
                      {currentStage >= 1 && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="absolute -top-4 -right-10 border border-orange-500/20 bg-orange-950/20 px-1.5 py-0.5 font-mono text-[8px] text-orange-400"
                        >
                          FLIR TEMP: 36.4°C
                        </motion.div>
                      )}
                      {currentStage >= 2 && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="absolute -bottom-2 -left-12 border border-rose-500/20 bg-rose-950/20 px-1.5 py-0.5 font-mono text-[8px] text-rose-400"
                        >
                          OCU_RATE: 72 BPM
                        </motion.div>
                      )}
                    </div>
                  )}

                  {decision === 'clear' && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 border border-emerald-500/30">
                          CLEARED FOR PASSAGE
                        </span>
                        <h4 className="text-sm font-bold text-white tracking-tight">Awaiting Document / Purchase Tray</h4>
                      </div>
                    </motion.div>
                  )}

                  {decision === 'lockdown' && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-pulse">
                        <Lock className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono uppercase bg-rose-500/20 text-rose-400 px-2 py-0.5 border border-rose-500/30">
                          FAILSAFE LOCKDOWN (400ms)
                        </span>
                        <h4 className="text-sm font-bold text-rose-500 tracking-tight">Perimeter Enclosure Hermetically Isolated</h4>
                      </div>
                    </motion.div>
                  )}
                </div>

              </div>

              {/* Live Telemetry Footer */}
              <div className="border-t border-white/5 pt-3.5 flex justify-between items-center font-mono text-[9px]">
                <div className="space-y-0.5 text-slate-500">
                  <div>STAGE: <span className="text-sky-400 font-bold">{stages[currentStage].title}</span></div>
                  <div>PROGRESS: <span className="text-white font-bold">{progress}%</span></div>
                </div>

                <div className="text-right text-slate-500 space-y-0.5">
                  <div>RADAR DETECT: <span className="text-emerald-400 font-bold">1 Approach</span></div>
                  <div>CORE SYNC: <span className="text-emerald-400 font-bold">100%</span></div>
                </div>
              </div>

            </div>

            {/* Quick action buttons to manual test decision paths during the POC splash */}
            {scanningCompleted && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3 bg-zinc-950 border border-white/5 p-3 font-mono text-[10px]"
              >
                <button
                  type="button"
                  onClick={simulateClear}
                  className={`py-2 text-center transition-all flex items-center justify-center gap-1.5 border rounded-none uppercase font-bold cursor-pointer ${
                    decision === 'clear' 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                      : 'border-white/5 bg-black hover:border-white/10 text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Simulate Safe Handoff
                </button>
                
                <button
                  type="button"
                  onClick={simulateLockdown}
                  className={`py-2 text-center transition-all flex items-center justify-center gap-1.5 border rounded-none uppercase font-bold cursor-pointer ${
                    decision === 'lockdown' 
                      ? 'border-rose-500 bg-rose-500/10 text-rose-400' 
                      : 'border-white/5 bg-black hover:border-white/10 text-slate-400'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-rose-500" />
                  Simulate Core Threat
                </button>
              </motion.div>
            )}

          </div>

          {/* Right Column: Progressive Stages & Automated Verification Copy (Span 6) */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.3em] uppercase text-sky-400 font-bold block">TANDEM SCANNING DIAGNOSTICS LOCKOUT</span>
              <h1 className="text-3xl font-light text-white tracking-tighter">
                Safe-Window <span className="font-serif italic text-sky-400">Threat-Deflection Matrix</span>
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                An underwritten security system that completely guarantees 24/7 revenue uptime with physical isolation. Commercial insurance discounts exceed 30% by relocating overnight business to a Level 3 ballistic window.
              </p>
            </div>

            {/* Stage Progress list */}
            <div className="space-y-3.5">
              {stages.map((st, idx) => {
                const isActive = currentStage === idx;
                const isPassed = currentStage > idx;
                
                return (
                  <div 
                    key={st.id}
                    className={`p-4 border transition-all relative flex gap-4 ${
                      isActive 
                        ? 'border-sky-400 bg-sky-400/5 shadow-[0_0_15px_rgba(56,189,248,0.08)]' 
                        : isPassed 
                        ? 'border-emerald-500/30 bg-emerald-500/[0.01]' 
                        : 'border-white/5 bg-zinc-950/20 opacity-40'
                    }`}
                  >
                    {/* Background tracking indicator line */}
                    {idx < stages.length - 1 && (
                      <div className="absolute left-[30px] top-[50px] bottom-[-22px] w-0.5 bg-white/5 z-0" />
                    )}

                    {/* Step Icon circle */}
                    <div className={`w-8 h-8 rounded-none border flex items-center justify-center shrink-0 z-10 font-mono text-xs font-bold ${
                      isActive 
                        ? 'border-sky-400 bg-sky-950 text-sky-400' 
                        : isPassed 
                        ? 'border-emerald-400 bg-emerald-950 text-emerald-400' 
                        : 'border-white/10 bg-zinc-950 text-slate-500'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-slate-500 uppercase">STAGE 0{idx + 1} //</span>
                        <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${isActive ? 'text-sky-400' : isPassed ? 'text-slate-300' : 'text-slate-500'}`}>
                          {st.title}
                        </h3>
                      </div>
                      <p className="text-xs font-serif italic text-slate-400 leading-none">{st.subtitle}</p>
                      
                      {isActive && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[11px] text-slate-300 leading-normal mt-2.5 font-light"
                        >
                          {st.description}
                        </motion.p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom progressive slider meter bar */}
            <div className="space-y-2 font-mono text-[10px]">
              <div className="flex justify-between items-center text-slate-400">
                <span>SYSTEM CALIBRATION AND BOOT PROGRESS:</span>
                <span className="text-white font-bold">{progress}% COMPLETE</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 border border-white/10 p-0.5">
                <motion.div 
                  className="bg-gradient-to-r from-sky-500 to-sky-400 h-full shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Status bar / action panel */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/5 pt-5 z-10 gap-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>TANDEM SCANNER SECURITY SYSTEM PRO-FORMA DEMO INCORPORATED</span>
          </div>

          <div className="flex items-center gap-3">
            {scanningCompleted && (
              <button
                onClick={restartScan}
                className="px-4 py-2 border border-white/10 hover:border-white/20 text-slate-300 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Re-Run Verification System
              </button>
            )}

            <button
              onClick={handleDismiss}
              className="px-6 py-2.5 bg-sky-400 hover:bg-sky-300 text-black font-mono font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
            >
              <span>Enter Investor Deck</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
};
