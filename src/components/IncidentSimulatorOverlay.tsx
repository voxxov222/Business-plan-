import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Eye, 
  RefreshCw, 
  X, 
  Play, 
  ArrowRight, 
  Video, 
  Siren, 
  AlertCircle,
  Radio,
  MapPin,
  Check,
  Crosshair,
  Sparkles,
  Activity,
  AlertTriangle,
  Fingerprint,
  UserCheck,
  Shield,
  Layers,
  HeartPulse
} from 'lucide-react';
import { trackSimStep } from '../lib/engagement';

interface IncidentSimulatorOverlayProps {
  isOpen: boolean;
  onClose: () => { void } | any;
}

export const IncidentSimulatorOverlay: React.FC<IncidentSimulatorOverlayProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<number>(0); // 0: Idle/Standby, 1: Approach, 2: Isolation, 3: Resolved
  const [isTrayExtended, setIsTrayExtended] = useState<boolean>(true);
  const [isWindowLocked, setIsWindowLocked] = useState<boolean>(false);
  const [isSirensActive, setIsSirensActive] = useState<boolean>(false);
  const [activeRightTab, setActiveRightTab] = useState<'cctv' | 'eps' | 'supply'>('cctv');

  // Track the simulation stages viewed
  useEffect(() => {
    if (isOpen) {
      trackSimStep(step);
    }
  }, [step, isOpen]);

  // Synchronize locking state with the simulation steps
  useEffect(() => {
    if (step === 0) {
      setIsTrayExtended(true);
      setIsWindowLocked(false);
      setIsSirensActive(false);
    } else if (step === 1) {
      setIsTrayExtended(true);
      setIsWindowLocked(false);
      setIsSirensActive(false);
    } else if (step === 2) {
      setIsTrayExtended(false);
      setIsWindowLocked(true);
      setIsSirensActive(true);
      // Automatically switch tab to EPS dispatch to show direct integration
      setActiveRightTab('eps');
    } else if (step === 3) {
      setIsTrayExtended(false);
      setIsWindowLocked(true);
      setIsSirensActive(false);
    }
  }, [step]);

  const triggerIncident = () => {
    setStep(1);
  };

  const executeLockdown = () => {
    setStep(2);
  };

  const resolveThreat = () => {
    setStep(3);
  };

  const resetSimulator = () => {
    setStep(0);
    setActiveRightTab('cctv');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-7xl bg-[#07090e] border border-sky-950 shadow-[0_0_50px_rgba(56,189,248,0.15)] flex flex-col lg:flex-row rounded-none overflow-hidden my-auto min-h-[85vh] lg:max-h-[90vh]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-30 bg-zinc-950 p-2 border border-sky-950 hover:border-sky-500/50"
              id="close-simulator-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Interactive Simulation Control panel */}
            <div className="w-full lg:w-[420px] p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-sky-950 flex flex-col justify-between bg-zinc-950/40 z-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-none animate-pulse">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-sky-400 font-mono font-bold block">AI Threat-Containment Suite</span>
                    <h2 className="text-2xl font-light tracking-tighter text-white">Safe-Portal <span className="font-serif italic text-sky-400">Lockdown Sim</span></h2>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Demonstrate how SafeMart integrates advanced AI threat-sensing and immediate law enforcement response protocols to safeguard staff while maintaining community service uptime.
                </p>

                {/* Timeline Step Controls */}
                <div className="space-y-3 pt-2">
                  
                  {/* Step 0 */}
                  <button
                    onClick={resetSimulator}
                    className={`w-full text-left p-4 border transition-all flex items-center justify-between cursor-pointer ${
                      step === 0 
                        ? 'border-sky-500/50 bg-sky-500/5' 
                        : 'border-white/5 bg-[#0a0c10]/80 hover:border-sky-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-none flex items-center justify-center font-mono text-[10px] font-bold ${
                        step === 0 ? 'bg-sky-400 text-black' : 'bg-white/10 text-white/70'
                      }`}>01</div>
                      <div>
                        <p className="text-xs font-bold text-white">Normal Standby</p>
                        <p className="text-[10px] text-slate-400">Neighborhood supply mode at 100%.</p>
                      </div>
                    </div>
                    {step === 0 && <span className="text-[8.5px] font-mono uppercase bg-sky-400/20 text-sky-400 px-2 py-0.5 font-bold">Safe</span>}
                  </button>

                  {/* Step 1 */}
                  <button
                    onClick={triggerIncident}
                    className={`w-full text-left p-4 border transition-all flex items-center justify-between cursor-pointer ${
                      step === 1 
                        ? 'border-amber-500/50 bg-amber-500/5' 
                        : 'border-white/5 bg-[#0a0c10]/80 hover:border-sky-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-none flex items-center justify-center font-mono text-[10px] font-bold ${
                        step === 1 ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/70'
                      }`}>02</div>
                      <div>
                        <p className="text-xs font-bold text-white">AI Facial Threat Sense</p>
                        <p className="text-[10px] text-slate-400">Loiterer/hostile pattern flagged.</p>
                      </div>
                    </div>
                    {step === 1 && <span className="text-[8.5px] font-mono uppercase bg-amber-400/20 text-amber-400 px-2 py-0.5 font-bold animate-pulse">Flagged</span>}
                  </button>

                  {/* Step 2 */}
                  <button
                    onClick={executeLockdown}
                    className={`w-full text-left p-4 border transition-all flex items-center justify-between cursor-pointer ${
                      step === 2 
                        ? 'border-red-500/50 bg-red-500/5' 
                        : 'border-white/5 bg-[#0a0c10]/80 hover:border-sky-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-none flex items-center justify-center font-mono text-[10px] font-bold ${
                        step === 2 ? 'bg-red-400 text-black' : 'bg-white/10 text-white/70'
                      }`}>03</div>
                      <div>
                        <p className="text-xs font-bold text-white">Hermetic Isolation & EPS Link</p>
                        <p className="text-[10px] text-slate-400">Tray locks back, EPS dispatch verified.</p>
                      </div>
                    </div>
                    {step === 2 && <span className="text-[8.5px] font-mono uppercase bg-red-400/20 text-red-400 px-2 py-0.5 font-bold animate-pulse">Dispatched</span>}
                  </button>

                  {/* Step 3 */}
                  <button
                    onClick={resolveThreat}
                    className={`w-full text-left p-4 border transition-all flex items-center justify-between cursor-pointer ${
                      step === 3 
                        ? 'border-emerald-500/50 bg-emerald-500/5' 
                        : 'border-white/5 bg-[#0a0c10]/80 hover:border-sky-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-none flex items-center justify-center font-mono text-[10px] font-bold ${
                        step === 3 ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white/70'
                      }`}>04</div>
                      <div>
                        <p className="text-xs font-bold text-white">Controlled Resolution</p>
                        <p className="text-[10px] text-slate-400">Threat neutralized. Neighborhood safe.</p>
                      </div>
                    </div>
                    {step === 3 && <span className="text-[8.5px] font-mono uppercase bg-emerald-400/20 text-emerald-400 px-2 py-0.5 font-bold">Secure</span>}
                  </button>
                </div>
              </div>

              {/* Security Metrics and Manual Actuators */}
              <div className="mt-8 border-t border-sky-950 pt-6 space-y-4">
                <h4 className="text-[9px] uppercase font-mono tracking-widest text-slate-500 font-bold">Clerk Protection State</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-sky-950 bg-black/60 p-3">
                    <span className="text-[8px] uppercase tracking-wider text-slate-500 block mb-1">Clerk Hazard Index</span>
                    <span className={`text-xs font-mono font-bold ${
                      step >= 2 ? 'text-emerald-400' : 'text-sky-400'
                    }`}>0% (IMPERVIOUS)</span>
                  </div>
                  <div className="border border-sky-950 bg-black/60 p-3">
                    <span className="text-[8px] uppercase tracking-wider text-slate-500 block mb-1">EPS Video Link</span>
                    <span className={`text-xs font-mono font-bold ${
                      step >= 2 ? 'text-rose-400 animate-pulse' : 'text-slate-500'
                    }`}>
                      {step >= 2 ? 'STREAMING LIVE' : 'ARMED / SLEEP'}
                    </span>
                  </div>
                </div>

                {/* Direct Action triggers */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setIsTrayExtended(!isTrayExtended);
                      if (step === 0 && isTrayExtended) setStep(1);
                    }}
                    className={`flex-1 py-2.5 text-[9px] font-mono tracking-wider font-bold uppercase border transition-all cursor-pointer ${
                      isTrayExtended 
                        ? 'border-sky-500/30 text-sky-400 hover:bg-sky-400/10' 
                        : 'border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isTrayExtended ? 'Retract Safe-Tray' : 'Extend Safe-Tray'}
                  </button>
                  <button
                    onClick={() => {
                      setIsWindowLocked(!isWindowLocked);
                      if (!isWindowLocked) {
                        setStep(2);
                      } else {
                        setStep(0);
                      }
                    }}
                    className={`flex-1 py-2.5 text-[9px] font-mono tracking-wider font-bold uppercase border transition-all cursor-pointer ${
                      isWindowLocked 
                        ? 'border-red-500 bg-red-500/10 text-red-400' 
                        : 'border-sky-500/30 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isWindowLocked ? 'Unlock Portal' : 'LOCK PORTAL NOW'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: High Fidelity CCTV, Facial Scanner, EPS Dispatch Tracking & Supply Index */}
            <div className="flex-1 flex flex-col justify-between bg-[#040609] p-6 sm:p-10 relative">
              {/* Subtle Scanline Overlay for CCTV feel */}
              <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-[0.02] mix-blend-overlay" />
              
              {/* TOP HEADER: Tabs to cycle through advanced visualizations */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sky-950 pb-4 mb-6 z-10 gap-4">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span className="text-xs font-mono tracking-widest text-slate-200">TACTICAL PORTAL DIAGNOSTICS</span>
                </div>

                {/* 3 Interactive HUD Tabs */}
                <div className="flex bg-[#020305] p-0.5 border border-sky-950 rounded-none shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveRightTab('cctv')}
                    className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                      activeRightTab === 'cctv'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Fingerprint className="w-3.5 h-3.5" />
                    CCTV & AI Radar
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRightTab('eps')}
                    className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer relative ${
                      activeRightTab === 'eps'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {step >= 2 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    )}
                    <Siren className="w-3.5 h-3.5" />
                    EPS Police Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRightTab('supply')}
                    className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                      activeRightTab === 'supply'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <HeartPulse className="w-3.5 h-3.5" />
                    Supply Continuity
                  </button>
                </div>
              </div>

              {/* MAIN ACTIVE SCREEN AREA */}
              <div className="flex-1 border border-sky-950 bg-black overflow-hidden flex flex-col justify-center items-center relative min-h-[400px]">
                
                {/* Sirens/Flashing visual effect during Stage 2 / Lockdown */}
                {isSirensActive && (
                  <motion.div 
                    animate={{ opacity: [0.05, 0.25, 0.05] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-0 bg-red-600/30 pointer-events-none z-10"
                  />
                )}

                {/* Simulated CCTV Camera Coordinates and REC indicators */}
                <div className="absolute inset-4 flex flex-col justify-between pointer-events-none z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 border border-white/5">
                      <span className={`w-1.5 h-1.5 rounded-full ${step >= 2 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                      <span className="text-[8px] font-mono text-slate-300">CCTV_NORTH_PORTAL_04</span>
                    </div>
                    <span className="text-[8.5px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 border border-white/5">
                      {step >= 2 ? 'REC [CRITICAL_EVENT]' : 'REC [LOOP_BUFFER]'}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[8px] font-mono text-slate-500">EDMONTON CITY // 118 AVE SITE</span>
                    <span className="text-[8px] font-mono text-slate-500">LAT: 53.5444° N // LON: 113.4909° W</span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: CCTV & FACIAL RECOGNITION AI SHIELD */}
                  {activeRightTab === 'cctv' && (
                    <motion.div 
                      key="cctv-tab"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex flex-col justify-between p-6 relative"
                    >
                      {/* Step description text bar */}
                      <div className="bg-[#030508]/90 border border-sky-950 p-3 flex gap-2.5 items-start mt-4 z-10 relative">
                        <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
                          step === 0 ? 'text-sky-400' :
                          step === 1 ? 'text-amber-400' :
                          step === 2 ? 'text-red-400 animate-bounce' : 'text-emerald-400'
                        }`} />
                        <div className="text-[11px] text-slate-300 space-y-1">
                          <span className="font-mono font-bold uppercase text-white block">
                            {step === 0 && "Normal Operation // Facial Scan Ready"}
                            {step === 1 && "AI Pre-Containment Alarm // Threat Warning Detected"}
                            {step === 2 && "HERMETIC LOCKDOWN // Direct EPS video stream established"}
                            {step === 3 && "Resolution Active // Target Defeated"}
                          </span>
                          <p className="text-slate-400">
                            {step === 0 && "The clerk serves late-night neighborhood clients behind an impenetrable 1.25\" ballistic polycarbonate frame. Safe-Tray extended."}
                            {step === 1 && "Our AI agent detects erratic late-night loitering profiles or aggressive posturing. Threat index elevated. Auto-warning activated."}
                            {step === 2 && "Hydraulic pistons retract transaction tray within 400ms. Triple-deadbolt interlocks secure the safe-window. Live feed auto-routes to Edmonton Police (EPS)."}
                            {step === 3 && "The threat was successfully blocked without physical clerk proximity. EPS dispatch is approaching. The safe-portal remains secure."}
                          </p>
                        </div>
                      </div>

                      {/* Tactical CCTV Visual Blueprint Frame */}
                      <div className="my-auto flex flex-col items-center justify-center relative py-6">
                        <div className="relative border border-sky-900/40 bg-zinc-950/40 p-4 w-full max-w-sm flex flex-col items-center">
                          
                          {/* Outer Camera Grid Outline */}
                          <div className="absolute inset-0 border border-sky-500/10 pointer-events-none" />
                          
                          {/* Face Reticle Overlay - dynamically placed to mock facial scanning */}
                          <div className="relative h-44 w-44 border border-dashed border-sky-800/30 rounded-full flex items-center justify-center">
                            
                            {/* Scanning horizontal laser bar */}
                            <motion.div 
                              animate={{ y: [-70, 70, -70] }}
                              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                              className={`absolute left-2 right-2 h-0.5 ${
                                step === 1 ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' :
                                step === 2 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' :
                                'bg-sky-400/60'
                              }`}
                            />

                            {/* Center Target Box */}
                            <motion.div 
                              animate={step >= 1 ? { scale: [1, 1.05, 1], borderColor: step === 2 ? '#ef4444' : '#f59e0b' } : {}}
                              className={`w-28 h-28 border-2 ${
                                step === 0 ? 'border-sky-500/20' :
                                step === 1 ? 'border-amber-500/60' :
                                step === 2 ? 'border-red-500 animate-pulse' :
                                'border-emerald-500/40'
                              } flex flex-col justify-between p-2 font-mono text-[8px]`}
                            >
                              <div className="flex justify-between">
                                <span className="border-t-2 border-l-2 p-1 border-current"></span>
                                <span className="border-t-2 border-r-2 p-1 border-current"></span>
                              </div>
                              
                              {/* Inside stats */}
                              <div className="text-center space-y-0.5">
                                <span className="block font-bold">
                                  {step === 0 && "SCANNING..."}
                                  {step === 1 && "TARGET FLAGGED"}
                                  {step === 2 && "HOSTILE ANOMALY"}
                                  {step === 3 && "THREAT RESET"}
                                </span>
                                <span className="block text-[7px] text-slate-500">
                                  {step === 0 && "ID: AT-9902"}
                                  {step === 1 && "MATCH: 92.4% SIG"}
                                  {step === 2 && "EMOTION: AGITATED"}
                                  {step === 3 && "CLEAR"}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="border-b-2 border-l-2 p-1 border-current"></span>
                                <span className="border-b-2 border-r-2 p-1 border-current"></span>
                              </div>
                            </motion.div>
                          </div>

                          {/* Instant Biometric Telemetry */}
                          <div className="w-full mt-4 bg-[#020305] p-2.5 border border-sky-950 font-mono text-[8px] grid grid-cols-2 gap-2 text-slate-400">
                            <div>
                              <span>THREAT PROBABILITY:</span>
                              <span className={`block font-bold text-[10px] ${
                                step === 0 ? 'text-sky-400' :
                                step === 1 ? 'text-amber-400' :
                                step === 2 ? 'text-red-500' : 'text-emerald-400'
                              }`}>
                                {step === 0 && "1.2% STANDBY"}
                                {step === 1 && "64.8% HIGH-RISK"}
                                {step === 2 && "99.7% COMBATIVE"}
                                {step === 3 && "0.0% RESOLVED"}
                              </span>
                            </div>
                            <div>
                              <span>WEAPON ALGORITHM:</span>
                              <span className={`block font-bold text-[10px] ${
                                step >= 1 ? 'text-rose-500 animate-pulse' : 'text-slate-500'
                              }`}>
                                {step === 0 && "NO MATCHES"}
                                {step === 1 && "POSTURE WARNING"}
                                {step === 2 && "CONCEALED METALLIC"}
                                {step === 3 && "RESOLVED"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {/* TAB 2: EDMONTON POLICE SERVICE (EPS) DISPATCH DIRECT LINK */}
                  {activeRightTab === 'eps' && (
                    <motion.div 
                      key="eps-tab"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex flex-col justify-between p-6 relative"
                    >
                      <div className="bg-rose-950/20 border border-red-900/40 p-3 mt-4 z-10 relative flex gap-2">
                        <Radio className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                        <div className="text-[11px] text-slate-300">
                          <span className="font-mono font-bold text-red-400 uppercase block">EPS DIRECT TELEMETRY DISPATCH LINK</span>
                          <p className="text-slate-400">
                            SafeMart portal systems route compressed real-time 4K live video feeds directly to the Edmonton Police Service (EPS) dispatchers over secured priority bands. Silent alarms instantly initiate GPS routing to the site.
                          </p>
                        </div>
                      </div>

                      {/* Map/Radar simulation HUD */}
                      <div className="my-auto grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto py-4">
                        
                        {/* Mock Map Radar */}
                        <div className="border border-sky-950 bg-black/80 h-44 rounded-none relative flex flex-col justify-center items-center overflow-hidden">
                          
                          {/* Radial sweeping line */}
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                            className="absolute w-60 h-60 border-l border-sky-500/20 rounded-full origin-center pointer-events-none"
                          />

                          {/* Concentric circles */}
                          <div className="absolute w-32 h-32 border border-sky-950/60 rounded-full" />
                          <div className="absolute w-20 h-20 border border-sky-950/30 rounded-full" />
                          
                          {/* GPS Markers */}
                          {/* Store Site */}
                          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-black z-10" />
                            <span className="text-[7px] font-mono text-sky-400 font-bold bg-black/90 px-1 border border-sky-900 mt-1">SAFEMART SITE</span>
                          </div>

                          {/* EPS patrol car */}
                          <motion.div 
                            animate={step >= 2 ? {
                              x: [50, 30, 10],
                              y: [-50, -25, -5],
                            } : { x: 80, y: -70 }}
                            className="absolute flex flex-col items-center"
                          >
                            <div className="relative">
                              <span className="w-3 h-3 rounded-full bg-red-500 border border-black z-10 block animate-pulse" />
                              <span className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-60" />
                            </div>
                            <span className="text-[7px] font-mono text-red-400 font-bold bg-black/90 px-1 border border-red-950 mt-1">EPS CRUISER 304</span>
                          </motion.div>

                          {/* Radar status text */}
                          <div className="absolute bottom-1 left-2 font-mono text-[7px] text-slate-500">
                            <span>EPS RADAR SWEEP // SYSTEM_OK</span>
                          </div>
                        </div>

                        {/* EPS Dispatch Logger and Status */}
                        <div className="border border-sky-950 bg-zinc-950/80 p-3 flex flex-col justify-between font-mono text-[8.5px]">
                          <div className="space-y-1.5">
                            <span className="text-slate-500 block border-b border-sky-950 pb-1 font-bold">EPS COMMAND DEPLOYMENT LOG</span>
                            <div className="space-y-1 text-slate-400 overflow-y-auto max-h-[100px] leading-tight">
                              <p className="text-slate-500">[01:14:22] - Silent heartbeat: OK</p>
                              {step >= 1 && (
                                <p className="text-amber-400">[01:14:23] - AI threat detection telemetry synced to EPS regional cache.</p>
                              )}
                              {step >= 2 && (
                                <>
                                  <p className="text-rose-400 font-bold animate-pulse">[01:14:25] - LOCKDOWN SIGNAL INITIATED BY STORE INTELLIGENCE.</p>
                                  <p className="text-rose-400 font-bold">[01:14:25] - Live HD Video Feed uplink confirmed: EPS Division East terminal.</p>
                                  <p className="text-white">[01:14:27] - Dispatch routed to EPS Cruiser 304.</p>
                                  <p className="text-emerald-400">[01:14:35] - Cruiser 304 ETA: 1.1 minutes. Code 3 sirens activated.</p>
                                </>
                              )}
                              {step >= 3 && (
                                <p className="text-emerald-400 font-bold">[01:14:55] - EPS Unit arrived on-site. Perimeter secured. Safe-Portal isolation success.</p>
                              )}
                            </div>
                          </div>

                          <div className="bg-black p-2 border border-sky-950/60 mt-2">
                            <span className="text-slate-500 block uppercase text-[7px]">Dispatch Response Status</span>
                            <span className={`text-[10px] font-bold ${
                              step === 0 ? 'text-slate-500' :
                              step === 1 ? 'text-amber-400' :
                              step === 2 ? 'text-red-400 animate-pulse' :
                              'text-emerald-400'
                            }`}>
                              {step === 0 && "STANDBY // MONITORING"}
                              {step === 1 && "ALARM ARMED // PRE-CHECK"}
                              {step === 2 && "CRUISER DEPLOYED // ETA 1 MIN"}
                              {step === 3 && "ON-SITE // TARGET SECURED"}
                            </span>
                          </div>
                        </div>

                      </div>

                    </motion.div>
                  )}

                  {/* TAB 3: NEIGHBORHOOD SUPPLY CONTINUITY */}
                  {activeRightTab === 'supply' && (
                    <motion.div 
                      key="supply-tab"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex flex-col justify-between p-6 relative"
                    >
                      <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 mt-4 z-10 relative flex gap-2">
                        <HeartPulse className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="text-[11px] text-slate-300">
                          <span className="font-mono font-bold text-emerald-400 uppercase block">NEIGHBORHOOD SERVICE SECURITY GUARANTEE</span>
                          <p className="text-slate-400">
                            Our advanced design guarantees that employee safety doesn't come at the expense of community resilience. SafeMart's portal keeps neighborhood residents supplied with high-priority late-night provisions under any operating condition.
                          </p>
                        </div>
                      </div>

                      {/* Interactive Supply Metrics Visuals */}
                      <div className="my-auto w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 py-4">
                        
                        {/* Continuity Gauge */}
                        <div className="md:col-span-5 border border-sky-950 bg-black/60 p-4 flex flex-col justify-between items-center text-center">
                          <span className="text-[8px] font-mono text-slate-500 uppercase">Community Supply Index</span>
                          
                          <div className="relative flex items-center justify-center my-2">
                            {/* Circle Gauge mock */}
                            <svg className="w-24 h-24 transform -rotate-95">
                              <circle cx="48" cy="48" r="40" stroke="#0f172a" strokeWidth="6" fill="transparent" />
                              <motion.circle 
                                cx="48" 
                                cy="48" 
                                r="40" 
                                stroke={step >= 2 ? '#e11d48' : '#10b981'} 
                                strokeWidth="6" 
                                fill="transparent" 
                                strokeDasharray="251.2"
                                animate={{ strokeDashoffset: step === 0 ? 0 : step === 1 ? 50 : step === 2 ? 150 : 0 }}
                                transition={{ duration: 1 }}
                              />
                            </svg>
                            <div className="absolute font-mono">
                              <span className="block text-lg font-bold text-white">
                                {step === 0 && "100%"}
                                {step === 1 && "80%"}
                                {step === 2 && "45%"}
                                {step === 3 && "100%"}
                              </span>
                              <span className="text-[7px] text-slate-400 block uppercase">Fulfillment</span>
                            </div>
                          </div>

                          <span className="text-[9px] font-mono text-slate-400">
                            {step === 0 && "All late-night items dispensable"}
                            {step === 1 && "AI screening high-risk items"}
                            {step === 2 && "EMERGENCY ITEMS ONLY VIA VAULT"}
                            {step === 3 && "Full catalog restored"}
                          </span>
                        </div>

                        {/* Category Status list */}
                        <div className="md:col-span-7 border border-sky-950 bg-[#020305] p-4 font-mono text-[8px] space-y-3">
                          <span className="text-slate-500 block font-bold border-b border-sky-950 pb-1">SAFE CATEGORY DISPENSATION MATRIX</span>
                          
                          <div className="space-y-2">
                            {/* Item 1 */}
                            <div className="flex justify-between items-center pb-1 border-b border-sky-950/40">
                              <span className="text-slate-300">Emergency & OTC Medications (Prescriptions, Insulin, Inhalers)</span>
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase text-[7px]">
                                ALWAYS ACTIVE
                              </span>
                            </div>

                            {/* Item 2 */}
                            <div className="flex justify-between items-center pb-1 border-b border-sky-950/40">
                              <span className="text-slate-300">Infant Supplies & Formula</span>
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase text-[7px]">
                                ALWAYS ACTIVE
                              </span>
                            </div>

                            {/* Item 3 */}
                            <div className="flex justify-between items-center pb-1 border-b border-sky-950/40">
                              <span className="text-slate-300">High-Calorie Hot Meals & Hot Beverages</span>
                              <span className={`px-1.5 py-0.5 font-bold uppercase text-[7px] ${
                                step >= 2 
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {step >= 2 ? 'LOCKED / RETRACTED' : 'Fulfillable'}
                              </span>
                            </div>

                            {/* Item 4 */}
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300">Late-Night Convenience Retail Goods</span>
                              <span className={`px-1.5 py-0.5 font-bold uppercase text-[7px] ${
                                step >= 2 
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {step >= 2 ? 'LOCKED / RETRACTED' : 'Fulfillable'}
                              </span>
                            </div>
                          </div>

                          <div className="bg-sky-950/15 border border-sky-900/30 p-2 text-[8px] text-slate-400 leading-normal">
                            <span className="font-bold text-white block mb-0.5">Automated Vault Drawer Protocol:</span>
                            During active alarm lockdowns, standard window opening is steel-plated. High-priority orders are securely rolled into the anti-passback transaction vault on the customer side via digital pin authorization, securing neighborhood service continuity.
                          </div>
                        </div>

                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>

              </div>

              {/* Lower Section: Comprehensive Live Log Output detailing EPS & AI Telemetry */}
              <div className="mt-6 bg-[#040609] border border-sky-950 p-5">
                <div className="flex items-center gap-3 mb-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Siren className="text-sky-400 w-4 h-4" />
                    <h4 className="text-xs uppercase tracking-wider text-white font-bold font-mono">System threat & EPS Dispatch telemetry</h4>
                  </div>
                  <span className="text-[8px] font-mono text-slate-500">SECURE SHELL CONNECTION established</span>
                </div>
                
                <div className="space-y-1 font-mono text-[9px] text-slate-400 max-h-[85px] overflow-y-auto pr-2">
                  <p className="text-slate-500">[01:14:01] SYSTEM_ONLINE // 118 Ave NW Safe-Portal camera initialized successfully.</p>
                  <p className="text-slate-500">[01:14:05] SENSORS // Night-Portal 1.25" level 3 ballistic glass seals: OK.</p>
                  <p className="text-slate-500">[01:14:15] AI_AGENT // Automated loitering radar and weapon posture checking: ACTIVE.</p>
                  
                  {step >= 1 && (
                    <p className="text-amber-400 font-bold">[01:14:22] AI_AGENT_WARNING // Subject displays high loiter latency (120s+). Hostility facial vector match triggers state warning. Strobe primed.</p>
                  )}
                  {step >= 2 && (
                    <>
                      <p className="text-red-400 font-bold">[01:14:25] ALARM_ACTIVATED // Emergency physical shield deployed. Steel deadbolt interlocks locked: 450 lbs hydraulic force.</p>
                      <p className="text-red-400 font-bold">[01:14:25] EPS_LINK // Silent dispatch packet containing 10-second pre-buffer HD camera footage streamed to Edmonton Police regional office.</p>
                      <p className="text-red-400">[01:14:26] SIRENS_ENGAGED // High-decibel vocal siren deterrents active at walk-up exterior.</p>
                      <p className="text-white font-bold">[01:14:30] EPS_UPLINK // Dispatcher confirmed. EPS Unit 304 in route. ETA 1.1 minutes.</p>
                    </>
                  )}
                  {step >= 3 && (
                    <>
                      <p className="text-emerald-400 font-bold">[01:14:55] EPS_ALERT // Edmonton Police response team arrived at coordinates. Hostility cleared.</p>
                      <p className="text-emerald-400 font-bold">[01:14:56] SYSTEM_SECURE // Vault drawer checked. Personnel inside isolated area unharmed. Continuity of emergency community supply maintained.</p>
                    </>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
