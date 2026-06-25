import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Thermometer, 
  ShieldAlert, 
  Fingerprint, 
  Lock, 
  Shield, 
  Eye, 
  HelpCircle,
  Activity,
  Sparkles,
  Cpu,
  Play,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  Radio
} from 'lucide-react';
import { InteractiveBlueprint } from './InteractiveBlueprint';

export const SecurityArchitecture = () => {
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [testOutcome, setTestOutcome] = useState<'none' | 'threat' | 'safe'>('none');
  const [scanProgress, setScanProgress] = useState<number>(0);

  // Auto-advance progress bars or simulation indicators during steps
  useEffect(() => {
    if (isTestActive) {
      setScanProgress(0);
      const timer = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 5;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isTestActive, currentStep]);

  const startTest = () => {
    setIsTestActive(true);
    setCurrentStep(1);
    setTestOutcome('none');
    setScanProgress(0);
  };

  const stopTest = () => {
    setIsTestActive(false);
    setCurrentStep(1);
    setTestOutcome('none');
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const triggerOutcome = (outcomeType: 'threat' | 'safe') => {
    setTestOutcome(outcomeType);
  };

  const resetTestOutcome = () => {
    setTestOutcome('none');
    setCurrentStep(4);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24"
      id="security-architecture-section"
    >
      {/* Chapter Card container */}
      <div className="border border-white/10 bg-zinc-900/30 p-8 sm:p-12 mb-8 relative">
        
        {/* Title and Metadata badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <span className="text-[9px] tracking-[0.3em] uppercase text-sky-400 font-mono font-bold block">
              Architectural Security // Chapter 05
            </span>
            <h2 className="text-4xl font-light text-white tracking-tighter">
              5. Security <span className="font-serif italic text-sky-400">Architecture</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 font-mono text-[9px] text-emerald-400 font-bold uppercase shrink-0">
            <ShieldCheck className="w-4 h-4" />
            Zero-Contact Protection Zone
          </div>
        </div>

        {/* Conceptual introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-serif italic text-white">Physical & Biometric Threat Deterrence</h3>
            <p className="text-xs sm:text-sm leading-relaxed opacity-70">
              SafeMart's physical footprint is engineered around a zero-compromise security posture. During late-night high-risk hours, the walk-up night-portal serves as a hermetic barrier between the public sphere and the secure cashier enclosure. Staff members operate in an elevated, secure core insulated from physical assault, forced entry attempts, or chemical hazards.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed opacity-70">
              By combining military-grade armor plates, ballistic multi-ply glazing, thermal imaging cameras, and instant police telemetry, the SafeMart Night-Portal eliminates the structural incentives for commercial robbery.
            </p>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="lg:col-span-5 bg-zinc-950/60 border border-sky-950/40 p-6 flex flex-col justify-between">
            <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 font-bold block mb-4">Underwritten Threat Metrics</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border-b border-sky-950/50 pb-3">
                <span className="text-[8px] uppercase font-mono text-slate-500 block mb-0.5">Ballistic Limit</span>
                <span className="text-base font-mono font-bold text-white">UL-752 Level 3</span>
              </div>
              <div className="border-b border-sky-950/50 pb-3">
                <span className="text-[8px] uppercase font-mono text-slate-500 block mb-0.5">Holding Strength</span>
                <span className="text-base font-mono font-bold text-white">450 lbs Tension</span>
              </div>
              <div>
                <span className="text-[8px] uppercase font-mono text-slate-500 block mb-0.5">Actuation Latency</span>
                <span className="text-base font-mono font-bold text-sky-400">&lt;400 Milliseconds</span>
              </div>
              <div>
                <span className="text-[8px] uppercase font-mono text-slate-500 block mb-0.5">Hazard Reduction</span>
                <span className="text-base font-mono font-bold text-emerald-400">99.8% Effective</span>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Grid: Explaining high-tech components */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 border-t border-b border-white/5 py-8">
          
          {/* Component 1: Thermal Sensors */}
          <div className="space-y-3 p-4 bg-zinc-950/20 border border-white/5 hover:border-sky-500/20 transition-all">
            <div className="p-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 w-fit">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Thermal Sensors</h4>
              <p className="text-[11px] text-slate-400 leading-normal mt-1">
                FLIR long-wave infrared arrays continuously scan the entry portal to detect concealed weapons beneath garments and monitor thermal agitation patterns.
              </p>
            </div>
          </div>

          {/* Component 2: Reinforced Glass */}
          <div className="space-y-3 p-4 bg-zinc-950/20 border border-white/5 hover:border-sky-500/20 transition-all">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Ballistic Glass</h4>
              <p className="text-[11px] text-slate-400 leading-normal mt-1">
                Laminated multi-ply polymer sheet (32mm) catches high-velocity rounds up to .44 Magnum, while keeping the inner cashier environment completely safe.
              </p>
            </div>
          </div>

          {/* Component 3: Automated Locks */}
          <div className="space-y-3 p-4 bg-zinc-950/20 border border-white/5 hover:border-sky-500/20 transition-all">
            <div className="p-2 bg-sky-500/10 border border-sky-500/30 text-sky-400 w-fit">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Automated Locks</h4>
              <p className="text-[11px] text-slate-400 leading-normal mt-1">
                Failsafe electromagnetic deadbolts instantly drop massive steel plates to isolate transaction bays in under 400ms on threat confirmation.
              </p>
            </div>
          </div>

          {/* Component 4: Biometric Scanners */}
          <div className="space-y-3 p-4 bg-zinc-950/20 border border-white/5 hover:border-sky-500/20 transition-all">
            <div className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 w-fit">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Biometric Scanners</h4>
              <p className="text-[11px] text-slate-400 leading-normal mt-1">
                Dual-factor fingerprint and 3D face scanners verify cashier identity prior to locking mechanisms releasing, avoiding override vulnerabilities.
              </p>
            </div>
          </div>

        </div>

        {/* ==================== TEST SYSTEM DIAGNOSTICS DECK ==================== */}
        <div className="border border-sky-500/20 bg-[#05060b] p-6 sm:p-8 mb-12 relative overflow-hidden" id="diagnostics-deck">
          {/* Subtle diagnostics background layout lines */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-white/10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span className="text-[8px] font-mono tracking-widest uppercase text-rose-400 font-bold">
                  Active Simulation Rig
                </span>
              </div>
              <h3 className="text-xl font-light text-white tracking-tight">
                Safe-Window <span className="font-serif italic text-sky-400">Tandem Scanner Diagnostics</span>
              </h3>
            </div>
            {!isTestActive ? (
              <button
                onClick={startTest}
                className="px-5 py-2.5 bg-sky-400 hover:bg-sky-300 text-black font-mono font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20"
              >
                <Activity className="w-4 h-4 animate-pulse" />
                Test System
              </button>
            ) : (
              <button
                onClick={stopTest}
                className="px-4 py-2 border border-rose-500/30 hover:border-rose-500/60 bg-rose-950/10 text-rose-400 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Terminate Test
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!isTestActive ? (
              <motion.div 
                key="launcher"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-10 text-center space-y-4 max-w-xl mx-auto"
              >
                <div className="p-4 bg-sky-500/5 border border-sky-500/10 rounded-full">
                  <Cpu className="w-10 h-10 text-sky-400" />
                </div>
                <h4 className="text-sm font-mono text-slate-300 uppercase font-bold">Interactive Scanner Verification Suite</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Trigger our diagnostics routine to inspect how SafeMart's <strong>FLIR thermal arrays</strong> and <strong>3D biometric facial-mesh profiling</strong> synchronize in real-time. This guided walk-through showcases our automatic threat detection and dual-factor cashier safety locks.
                </p>
                <button
                  onClick={startTest}
                  className="px-6 py-3 bg-zinc-900 border border-sky-500/30 hover:border-sky-500/70 text-sky-400 hover:text-white font-mono font-bold text-[10.5px] uppercase tracking-widest transition-all cursor-pointer"
                >
                  Launch Diagnostic Walk-Through
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="test-active"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                {/* Left Column: Technical Sensor Telemetry */}
                <div className="lg:col-span-5 bg-[#030406] border border-white/5 p-5 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase block mb-3">Live Diagnostics Output Panel</span>
                    
                    {/* Diagnostic Screen Status Header */}
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-2 mb-4">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        RIG-SYS: ONLINE
                      </span>
                      <span className="text-sky-400">STAGE {currentStep} / 4</span>
                    </div>

                    {/* Visual Scanners Representation */}
                    <div className="space-y-4">
                      {/* Thermal feed representation */}
                      <div className="border border-white/5 bg-[#08090d] p-3 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-1 text-[8.5px] font-mono">
                          <span className="text-orange-400 font-bold flex items-center gap-1">
                            <Thermometer className="w-3.5 h-3.5" />
                            FLIR THERMAL SCANNER
                          </span>
                          <span className="text-slate-500">LWIR 8.4μm Frame</span>
                        </div>

                        {/* Interactive scan visualization */}
                        <div className="h-20 bg-gradient-to-r from-orange-500/5 to-purple-500/5 border border-orange-500/10 flex items-center justify-center relative">
                          {/* Scan bar effect */}
                          {currentStep >= 2 && (
                            <motion.div 
                              animate={{ top: ['0%', '100%', '0%'] }} 
                              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                              className="absolute inset-x-0 h-0.5 bg-orange-400/50 shadow-[0_0_8px_rgba(251,146,60,0.5)]"
                            />
                          )}
                          
                          {/* Thermal text telemetry based on step */}
                          <div className="text-center font-mono space-y-1 z-10">
                            {currentStep === 1 && (
                              <p className="text-[10px] text-slate-500">STANDBY - Awaiting approach</p>
                            )}
                            {currentStep === 2 && (
                              <>
                                <p className="text-[11px] text-orange-400 font-bold animate-pulse">ANALYZING ENVELOPE...</p>
                                <p className="text-[8.5px] text-slate-400">Mean Temp: 36.4°C // Void Factor: Normal</p>
                              </>
                            )}
                            {currentStep === 3 && (
                              <>
                                <p className="text-[11px] text-emerald-400 font-bold">PROFILE CLEAR</p>
                                <p className="text-[8.5px] text-slate-400">Garment Transparency: 99.4% Pass</p>
                              </>
                            )}
                            {currentStep === 4 && testOutcome === 'none' && (
                              <p className="text-[10px] text-slate-400">Awaiting Decision Branch</p>
                            )}
                            {currentStep === 4 && testOutcome === 'safe' && (
                              <>
                                <p className="text-[11px] text-emerald-400 font-bold">PASS // THERMAL PROFILE SECURE</p>
                                <p className="text-[8.5px] text-slate-400">Zero threat vectors detected</p>
                              </>
                            )}
                            {currentStep === 4 && testOutcome === 'threat' && (
                              <>
                                <p className="text-[11px] text-rose-500 font-bold animate-pulse">THREAT DETECTED: COLD VOID ANOMALY</p>
                                <p className="text-[8.5px] text-rose-400 font-bold">Metallic density profile matches concealed firearm model (98.4%)</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Biometric feed representation */}
                      <div className="border border-white/5 bg-[#08090d] p-3 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-1 text-[8.5px] font-mono">
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <Fingerprint className="w-3.5 h-3.5" />
                            3D BIOMETRIC SECURE SCANNER
                          </span>
                          <span className="text-slate-500">Ocular Mesh Lock</span>
                        </div>

                        {/* Interactive scan visualization */}
                        <div className="h-20 bg-gradient-to-r from-rose-500/5 to-purple-500/5 border border-rose-500/10 flex items-center justify-center relative">
                          {/* Scan circle/target effect */}
                          {currentStep >= 3 && (
                            <motion.div 
                              animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.4, 0.8, 0.4] }} 
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="absolute w-12 h-12 rounded-full border border-rose-500/30"
                            />
                          )}
                          
                          {/* Biometric text telemetry based on step */}
                          <div className="text-center font-mono space-y-1 z-10">
                            {currentStep === 1 && (
                              <p className="text-[10px] text-slate-500">Awaiting Coordinate Lock</p>
                            )}
                            {currentStep === 2 && (
                              <>
                                <p className="text-[10px] text-slate-400 animate-pulse">LOCKED // GATHERING COORDINATE MATRIX...</p>
                                <p className="text-[8px] text-slate-500">92 skeletal joints indexed</p>
                              </>
                            )}
                            {currentStep === 3 && (
                              <>
                                <p className="text-[11px] text-rose-400 font-bold">BIOMETRIC ASSESSMENT ACTIVE</p>
                                <p className="text-[8.5px] text-slate-400">Iris micro-pulses stable // Stress coefficient low</p>
                              </>
                            )}
                            {currentStep === 4 && testOutcome === 'none' && (
                              <p className="text-[10px] text-slate-400">Awaiting Decision Branch</p>
                            )}
                            {currentStep === 4 && testOutcome === 'safe' && (
                              <>
                                <p className="text-[11px] text-emerald-400 font-bold">VERIFIED COGNITIVE PATTERN</p>
                                <p className="text-[8.5px] text-slate-400">Iris & face model matched cleanly</p>
                              </>
                            )}
                            {currentStep === 4 && testOutcome === 'threat' && (
                              <>
                                <p className="text-[11px] text-rose-500 font-bold animate-pulse">RAPID COGNITIVE AGITATION SPIKE</p>
                                <p className="text-[8.5px] text-rose-400 font-bold">Distress pulse matches high-adrenaline hostility template</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real-time sync meter status */}
                  <div className="bg-zinc-950 p-3.5 border border-white/5 font-mono text-[9px] space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Tandem Core Synced:</span>
                      <span className={currentStep >= 3 ? "text-emerald-400 font-bold" : "text-sky-400"}>
                        {currentStep >= 3 ? "SYNCHRONIZED (100%)" : "ESTABLISHING LINK..."}
                      </span>
                    </div>
                    {/* Live progress bar */}
                    <div className="w-full bg-zinc-900 h-1.5 border border-white/10 rounded-none relative">
                      <motion.div 
                        className="bg-sky-400 h-full" 
                        style={{ width: `${currentStep * 25}%` }}
                        transition={{ ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Step-by-Step Guided Wizard Content */}
                <div className="lg:col-span-7 flex flex-col justify-between bg-zinc-950/40 border border-white/5 p-6 sm:p-8">
                  
                  {/* Tabbed Step Progress */}
                  <div className="flex justify-between items-center gap-1 border-b border-white/5 pb-4 mb-6">
                    {[1, 2, 3, 4].map((stepNum) => (
                      <button
                        key={stepNum}
                        onClick={() => testOutcome === 'none' || stepNum < 4 ? setCurrentStep(stepNum) : null}
                        disabled={testOutcome !== 'none' && stepNum === 4}
                        className={`flex-1 text-center font-mono py-1.5 text-[9px] uppercase border font-bold transition-all ${
                          currentStep === stepNum
                            ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                            : 'border-white/5 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        Step {stepNum}
                      </button>
                    ))}
                  </div>

                  {/* Step Descriptive Content */}
                  <div className="flex-1 min-h-[180px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-3"
                        >
                          <span className="text-[8px] font-mono uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5">
                            Stage 01: Perimeter Activation
                          </span>
                          <h4 className="text-base font-bold text-white tracking-tight">Perimeter Radar & System Awakening</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-light">
                            When a customer approaches the night portal bay at 4412 36 Ave NW, microwave radar and proximity rangefinders immediately detect physical motion. This wakes the main controller unit from safe standby and displays the live feed on the cashier’s high-contrast secure cockpit screen.
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed font-light font-mono text-sky-400/80">
                            ► Tandem action initiated: Optical focus shifts to target depth coordinates and FLIR core prepares thermal imaging loops.
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-3"
                        >
                          <span className="text-[8px] font-mono uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5">
                            Stage 02: Thermal Density Checks
                          </span>
                          <h4 className="text-base font-bold text-white tracking-tight">FLIR Thermal Weapon & Stress Profiling</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-light">
                            The FLIR LWIR optical array continuously maps human skin temperature and garment heat transparency. Concealed high-density objects, like a steel handgun or pry bar, block regular thermal body heat, appearing as distinct cold voids beneath clothing.
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed font-light font-mono text-orange-400/80">
                            ► Tandem action: The thermal processor extracts coordinate data for suspected dense regions and relays them directly to the biometric face-lock scanner to check for matching emotional/pulse stress indicators.
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-3"
                        >
                          <span className="text-[8px] font-mono uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5">
                            Stage 03: Biometric Synchrony
                          </span>
                          <h4 className="text-base font-bold text-white tracking-tight">Ocular Mapping & Adrenaline Analysis</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-light">
                            Simultaneously, the biometric system locks onto facial geometry. It maps structural node dimensions and uses microscopic camera adjustments to track ocular micro-pulses (pulse rate from iris capillary expansion).
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed font-light font-mono text-rose-400/80">
                            ► Tandem action: Thermal spikes on the forehead or neck, when paired with rapid biometric pulse expansion and a thermal weapon void, verify high physical intent coordinates before a threat is even physically manifested.
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-3"
                        >
                          {testOutcome === 'none' && (
                            <div className="space-y-4">
                              <span className="text-[8px] font-mono uppercase bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2 py-0.5">
                                Stage 04: Decision Loop
                              </span>
                              <h4 className="text-base font-bold text-white tracking-tight">Trigger Portal Threat Assessment Outcomes</h4>
                              <p className="text-xs text-slate-400 leading-relaxed font-light">
                                The diagnostic loop is fully compiled. To see how these advanced sensors operate in tandem to either facilitate secure neighborhood convenience access or implement a total structural lockdown, choose one of the simulations below:
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <button
                                  onClick={() => triggerOutcome('safe')}
                                  className="p-3 border border-emerald-500/20 bg-emerald-950/5 hover:bg-emerald-500/10 text-emerald-400 hover:text-white font-mono text-[10px] uppercase font-bold text-left transition-all cursor-pointer flex flex-col gap-1 rounded-none"
                                >
                                  <span className="flex items-center gap-1 text-xs">
                                    <Check className="w-3.5 h-3.5" />
                                    1. Clean Handoff
                                  </span>
                                  <span className="text-[9px] text-slate-400 normal-case font-sans font-light">
                                    Simulate safe healthcare shift worker. Thermal profile matches normal limits, biometric face-mesh verified.
                                  </span>
                                </button>

                                <button
                                  onClick={() => triggerOutcome('threat')}
                                  className="p-3 border border-red-500/20 bg-red-950/5 hover:bg-red-500/10 text-red-400 hover:text-white font-mono text-[10px] uppercase font-bold text-left transition-all cursor-pointer flex flex-col gap-1 rounded-none"
                                >
                                  <span className="flex items-center gap-1 text-xs">
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    2. Weapon Detected
                                  </span>
                                  <span className="text-[9px] text-slate-400 normal-case font-sans font-light">
                                    Simulate high-risk concealed metal mass with rapid adrenaline biometric spike. Instantly locks night portal.
                                  </span>
                                </button>
                              </div>
                            </div>
                          )}

                          {testOutcome === 'safe' && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 border border-emerald-500/30 bg-emerald-950/10 space-y-3"
                            >
                              <div className="flex items-center gap-2 text-emerald-400">
                                <ShieldCheck className="w-5 h-5" />
                                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Outcome: Secure Commerce Allowed</h4>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed font-light">
                                Excellent. Both thermal and biometric signatures remain within standard, calm parameters. The cashier and customer converse freely through the deflection-baffled acoustic natural voice grille. The cashier utilizes the dual-door mechanical interlock tray to pass milk, groceries, or household necessities out safely, maintaining zero physical access vectors into the cabin.
                              </p>
                              <button
                                onClick={resetTestOutcome}
                                className="px-3.5 py-1.5 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] uppercase tracking-wider hover:bg-emerald-500/10 transition-all cursor-pointer"
                              >
                                Test Another Outcome
                              </button>
                            </motion.div>
                          )}

                          {testOutcome === 'threat' && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 border border-red-500/30 bg-red-950/10 space-y-3"
                            >
                              <div className="flex items-center gap-2 text-red-400">
                                <ShieldAlert className="w-5 h-5 animate-bounce" />
                                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Outcome: Instant Failsafe Lockdown (<span className="text-sky-400">400ms</span>)</h4>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed font-light">
                                <strong>Tandem Threat Confirmation Triggered!</strong> FLIR identifies a cold void signature matching a heavy steel handgun grip in the visitor's side jacket. Simultaneously, the biometric face scan detects a 40% dilation spike in ocular pulse, mapping sudden high aggression coordinates.
                              </p>
                              <p className="text-xs text-rose-300 font-mono leading-relaxed bg-black/60 p-2.5 border border-red-500/20">
                                🔒 Electromagnetic deadbolts seal transaction ports instantly. Steel shields drop over bulk drawers. Direct encrypted data link forwards high-def CCTV footage & coordinates directly to the Edmonton Police Service dispatcher.
                              </p>
                              <button
                                onClick={resetTestOutcome}
                                className="px-3.5 py-1.5 border border-red-500/30 text-red-400 font-mono text-[9px] uppercase tracking-wider hover:bg-red-500/10 transition-all cursor-pointer"
                              >
                                Test Another Outcome
                              </button>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Wizard Control Navigation Buttons */}
                  <div className="flex justify-between items-center border-t border-white/5 pt-5 mt-6 font-mono text-[9px]">
                    <button
                      onClick={handlePrev}
                      disabled={currentStep === 1}
                      className={`px-3 py-1.5 border transition-all cursor-pointer uppercase font-bold flex items-center gap-1 ${
                        currentStep === 1
                          ? 'border-white/5 text-slate-600 cursor-not-allowed'
                          : 'border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      ◄ Previous
                    </button>
                    
                    <span className="text-slate-500 font-semibold">Tandem Scanner Loop</span>

                    {currentStep < 4 ? (
                      <button
                        onClick={handleNext}
                        className="px-3 py-1.5 border border-sky-500/30 hover:border-sky-500 text-sky-400 hover:text-white bg-sky-500/5 transition-all cursor-pointer uppercase font-bold flex items-center gap-1"
                      >
                        Next Stage ►
                      </button>
                    ) : (
                      <button
                        onClick={stopTest}
                        className="px-3 py-1.5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer uppercase font-bold"
                      >
                        Reset Rig
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* ==================== END OF TEST SYSTEM DIAGNOSTICS DECK ==================== */}

        {/* Embedded Interactive Diagram Container */}
        <div className="border border-sky-950 bg-black/40 overflow-hidden">
          <div className="p-6 border-b border-sky-950 bg-sky-950/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-400 animate-pulse" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-200">
                Interactive Night-Portal Blueprint Rig
              </span>
            </div>
            <span className="text-[8px] font-mono text-sky-500 uppercase bg-sky-500/15 border border-sky-500/30 px-2 py-0.5">
              Live Interactive HUD
            </span>
          </div>

          {/* The Interactive Blueprint component itself rendered INLINE! */}
          <InteractiveBlueprint />
        </div>

      </div>
    </motion.section>
  );
};
