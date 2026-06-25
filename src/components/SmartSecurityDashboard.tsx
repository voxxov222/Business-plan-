import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Fingerprint, 
  Siren, 
  Video, 
  Activity, 
  Radio, 
  Camera, 
  AlertTriangle, 
  Search, 
  Database, 
  Cpu, 
  Clock, 
  Wifi, 
  BellRing, 
  Server, 
  Sliders, 
  Play, 
  Power,
  RefreshCw,
  Heart,
  ChevronRight,
  Sparkles,
  ShieldAlert as AlertIcon,
  Zap,
  Thermometer,
  Layers
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  event: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  agent: string;
}

interface BiometricLog {
  id: string;
  timestamp: string;
  sensorType: 'thermal' | 'object' | 'proximity' | 'biometric';
  description: string;
  status: 'normal' | 'notice' | 'flagged';
  value: string;
}

const INITIAL_BIOMETRIC_LOGS: BiometricLog[] = [
  { id: 'B1', timestamp: '06:55:10', sensorType: 'thermal', description: 'Thermal scan: hand warmth pattern', status: 'normal', value: '36.4°C' },
  { id: 'B2', timestamp: '06:54:45', sensorType: 'object', description: 'Handheld object recognition checklist', status: 'normal', value: 'Polymer Card' },
  { id: 'B3', timestamp: '06:54:12', sensorType: 'proximity', description: 'Lidar rangefinder distance reading', status: 'normal', value: '32.1 cm' },
  { id: 'B4', timestamp: '06:53:22', sensorType: 'biometric', description: 'Sub-dermal vascular structure match', status: 'normal', value: 'Pass (99.4%)' },
  { id: 'B5', timestamp: '06:52:01', sensorType: 'thermal', description: 'Shoulder profile IR spectrum baseline', status: 'normal', value: 'Normal spectrum' },
];

interface FaceScan {
  id: string;
  time: string;
  genderEstimate: string;
  ageRange: string;
  confidence: number;
  threatLevel: 'low' | 'medium' | 'high';
  status: 'Recognized' | 'Anonymous' | 'Flagged';
  avatarSeed: number;
}

const INITIAL_FACES: FaceScan[] = [
  { id: 'FC-9081', time: '06:54:12', genderEstimate: 'Male', ageRange: '28-32', confidence: 98.4, threatLevel: 'low', status: 'Recognized', avatarSeed: 1 },
  { id: 'FC-4320', time: '06:51:04', genderEstimate: 'Female', ageRange: '22-26', confidence: 91.2, threatLevel: 'low', status: 'Recognized', avatarSeed: 2 },
  { id: 'FC-7711', time: '06:48:59', genderEstimate: 'Male', ageRange: '45-50', confidence: 45.8, threatLevel: 'medium', status: 'Anonymous', avatarSeed: 3 },
  { id: 'FC-0912', time: '06:33:10', genderEstimate: 'Female', ageRange: '31-35', confidence: 99.1, threatLevel: 'low', status: 'Recognized', avatarSeed: 4 },
];

const INITIAL_LOGS: LogEntry[] = [
  { id: 'L1', timestamp: '06:55:01', event: 'FLIR Thermal multi-sensor baseline calibrated.', type: 'info', agent: 'Thermal_Scan_01' },
  { id: 'L2', timestamp: '06:54:12', event: 'Known customer delivery authorized (ID: FC-9081).', type: 'success', agent: 'Biometric_Gate' },
  { id: 'L3', timestamp: '06:52:45', event: 'CCTV-North-Portal loiter threshold warning (45 seconds).', type: 'warning', agent: 'AI_Radar_North' },
  { id: 'L4', timestamp: '06:51:04', event: 'Matched regular client profile (ID: FC-4320).', type: 'success', agent: 'Facial_Engine' },
  { id: 'L5', timestamp: '06:48:59', event: 'Unidentified thermal signature detected behind window frame.', type: 'info', agent: 'Thermal_Scan_01' },
  { id: 'L6', timestamp: '06:40:12', event: 'Direct EPS encrypted priority trunk heartbeat confirmed.', type: 'success', agent: 'EPS_Link' },
];

export const SmartSecurityDashboard = () => {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [faces, setFaces] = useState<FaceScan[]>(INITIAL_FACES);
  const [biometricLogs, setBiometricLogs] = useState<BiometricLog[]>(INITIAL_BIOMETRIC_LOGS);
  const [epsStatus, setEpsStatus] = useState<'online' | 'standby' | 'alert' | 'offline'>('online');
  const [isLiveFeedActive, setIsLiveFeedActive] = useState<boolean>(true);
  const [aiSensitivity, setAiSensitivity] = useState<number>(85);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [scannedCount, setScannedCount] = useState<number>(142);
  const [unidentifiedCount, setUnidentifiedCount] = useState<number>(3);
  const [activeCamera, setActiveCamera] = useState<string>('CCTV_NORTH_PORTAL_04');

  // Interactive metrics simulation
  const [threatLevelValue, setThreatLevelValue] = useState<number>(5); // 0 to 100

  // Handle periodic log simulation to make the dashboard feel active and real-time
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      // Create random scan event
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      
      const eventChance = Math.random();

      // Simulate a biometric scan log entry on every interval check
      const bioLogTemplates = [
        { sensorType: 'thermal' as const, description: 'FLIR core thermal envelope update', values: ['36.5°C', '36.7°C', '36.2°C', '36.6°C'] },
        { sensorType: 'thermal' as const, description: 'Ambient temperature delta validation', values: ['+0.01°C', '-0.02°C', '0.00°C', '+0.03°C'] },
        { sensorType: 'object' as const, description: 'Object recognition profile check', values: ['Cell Phone (94%)', 'Wallet (89%)', 'Coffee Cup (97%)', 'Key Ring (91%)'] },
        { sensorType: 'object' as const, description: 'Nylon garment fiber classification', values: ['Loose Fit', 'Medium Fit', 'Heavy Jacket'] },
        { sensorType: 'proximity' as const, description: 'Portal safety zone distance matrix', values: ['41.5 cm', '39.2 cm', '45.1 cm', '33.8 cm'] },
        { sensorType: 'proximity' as const, description: 'Lidar point cloud array density', values: ['842 pts/cm²', '851 pts/cm²', '839 pts/cm²'] },
        { sensorType: 'biometric' as const, description: 'Skeletal coordinate grid gait rate', values: ['0.82 m/s', '0.64 m/s', '0.91 m/s'] },
        { sensorType: 'biometric' as const, description: 'Ocular iris micro-pulse verification', values: ['Matched', 'Standby', 'Verified'] }
      ];

      const template = bioLogTemplates[Math.floor(Math.random() * bioLogTemplates.length)];
      const randomVal = template.values[Math.floor(Math.random() * template.values.length)];
      
      const newBioLog: BiometricLog = {
        id: `B-${Date.now()}`,
        timestamp: timeStr,
        sensorType: template.sensorType,
        description: template.description,
        status: 'normal',
        value: randomVal
      };

      setBiometricLogs(prev => [newBioLog, ...prev.slice(0, 5)]);

      if (eventChance > 0.6) {
        // Generate new face scan
        const isAnomaly = Math.random() > 0.85;
        const confidenceVal = parseFloat((80 + Math.random() * 19.9).toFixed(1));
        const newFaceId = `FC-${Math.floor(1000 + Math.random() * 9000)}`;
        const ages = ['18-24', '25-30', '31-35', '36-45', '46-55'];
        const randomAge = ages[Math.floor(Math.random() * ages.length)];
        const randomGender = Math.random() > 0.5 ? 'Male' : 'Female';

        const newFace: FaceScan = {
          id: newFaceId,
          time: timeStr,
          genderEstimate: randomGender,
          ageRange: randomAge,
          confidence: confidenceVal,
          threatLevel: isAnomaly ? 'high' : (Math.random() > 0.7 ? 'medium' : 'low'),
          status: isAnomaly ? 'Flagged' : (Math.random() > 0.6 ? 'Recognized' : 'Anonymous'),
          avatarSeed: Math.floor(Math.random() * 100)
        };

        setFaces(prev => [newFace, ...prev.slice(0, 5)]);
        setScannedCount(c => c + 1);

        // Add corresponding log
        const logEntry: LogEntry = {
          id: `L_NEW_${Date.now()}`,
          timestamp: timeStr,
          event: isAnomaly 
            ? `AI AGENT FLAG: High-risk face posture match detected (${confidenceVal}% matched attributes).`
            : `Biometric capture: Face logged successfully. Conf: ${confidenceVal}%`,
          type: isAnomaly ? 'critical' : 'info',
          agent: 'Facial_Engine'
        };
        setLogs(prev => [logEntry, ...prev.slice(0, 10)]);

        if (isAnomaly) {
          setThreatLevelValue(prev => Math.min(prev + 30, 95));
          if (epsStatus === 'online') {
            setEpsStatus('standby');
          }
          // Flagged biometric entry
          const anomalyBioLog: BiometricLog = {
            id: `B-ANOM-${Date.now()}`,
            timestamp: timeStr,
            sensorType: 'thermal',
            description: 'Thermal anomaly: Elevated facial temperature spike',
            status: 'notice',
            value: '37.8°C'
          };
          setBiometricLogs(prevLogs => [anomalyBioLog, ...prevLogs.slice(0, 5)]);
        } else {
          setThreatLevelValue(prev => Math.max(prev - 5, 4));
        }

      } else {
        // General security log
        const securityEvents = [
          'Direct EPS Link encrypted signal refresh: Latency 14ms.',
          'FLIR core continuous thermopile grid refresh: 0.02C delta.',
          'Ultrasonic distance sensors register walk-up proximity: clear.',
          'Safe-Window double-deadbolts structural check: Locked.',
          'Secondary supply vault carousel calibrated.'
        ];
        const randomEvent = securityEvents[Math.floor(Math.random() * securityEvents.length)];
        const logEntry: LogEntry = {
          id: `L_NEW_${Date.now()}`,
          timestamp: timeStr,
          event: randomEvent,
          type: randomEvent.includes('encrypted') || randomEvent.includes('calibration') ? 'success' : 'info',
          agent: randomEvent.includes('EPS') ? 'EPS_Link' : 'System_Monitor'
        };
        setLogs(prev => [logEntry, ...prev.slice(0, 10)]);
      }

    }, 4500);

    return () => clearInterval(interval);
  }, [isScanning, epsStatus]);

  // Action: Manually simulate a dangerous hostile threat
  const simulateHostileThreat = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const targetFace: FaceScan = {
      id: 'FC-ALERT-911',
      time: timeStr,
      genderEstimate: 'Male',
      ageRange: '25-30',
      confidence: 99.7,
      threatLevel: 'high',
      status: 'Flagged',
      avatarSeed: 99
    };

    setFaces(prev => [targetFace, ...prev]);
    setThreatLevelValue(98);
    setEpsStatus('alert');
    setUnidentifiedCount(u => u + 1);

    const alertLog1: LogEntry = {
      id: `AL-1-${Date.now()}`,
      timestamp: timeStr,
      event: 'CRITICAL WARNING: Aggressive weapon drawing pattern match detected (Facial + Posture).',
      type: 'critical',
      agent: 'AI_Radar_North'
    };

    const alertLog2: LogEntry = {
      id: `AL-2-${Date.now()}`,
      timestamp: timeStr,
      event: 'AUTOMATED PORTAL ACTION: Fast-action locks activated. Safe-Tray forcefully retracted.',
      type: 'critical',
      agent: 'Biometric_Gate'
    };

    const alertLog3: LogEntry = {
      id: `AL-3-${Date.now()}`,
      timestamp: timeStr,
      event: 'EDMONTON POLICE DEPLOYMENT: Direct telemetry payload stream uploaded to EPS dispatcher.',
      type: 'success',
      agent: 'EPS_Link'
    };

    setLogs(prev => [alertLog1, alertLog2, alertLog3, ...prev.slice(0, 8)]);

    // Simulate high-threat biometric scans
    const alarmBioLog1: BiometricLog = {
      id: `B-A1-${Date.now()}`,
      timestamp: timeStr,
      sensorType: 'object',
      description: 'HIGH THREAT PATTERN DETECTED',
      status: 'flagged',
      value: 'Concealed Handgun (98%)'
    };
    const alarmBioLog2: BiometricLog = {
      id: `B-A2-${Date.now()}`,
      timestamp: timeStr,
      sensorType: 'thermal',
      description: 'Abrupt stress-induced facial warmth spike',
      status: 'notice',
      value: '37.9°C (Elevated)'
    };
    setBiometricLogs(prev => [alarmBioLog1, alarmBioLog2, ...prev.slice(0, 4)]);
  };

  const resetAllThreats = () => {
    const nowStr = new Date().toTimeString().split(' ')[0];
    setThreatLevelValue(5);
    setEpsStatus('online');
    setLogs(prev => [{
      id: `L_RESET_${Date.now()}`,
      timestamp: nowStr,
      event: 'System manually restored to standard standby mode. EPS loop clear.',
      type: 'success',
      agent: 'System_Monitor'
    }, ...prev.slice(0, 8)]);

    setBiometricLogs(prev => [{
      id: `B-R-${Date.now()}`,
      timestamp: nowStr,
      sensorType: 'biometric',
      description: 'Biometric telemetry cleared & recalibrated',
      status: 'normal',
      value: 'Armed'
    }, ...prev.slice(0, 5)]);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24 border border-white/10 bg-zinc-950 p-6 sm:p-10 relative overflow-hidden"
      id="smart-security-dashboard-section"
    >
      {/* Background visual graphics */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/[0.01] rounded-full blur-[100px] pointer-events-none" />
      
      {/* HEADER BAR */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <span className="text-[9px] tracking-[0.3em] uppercase text-rose-400 font-mono font-bold block">AI Agent Control Grid</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tighter">
            Smart Security <span className="font-serif italic text-rose-400">Tactical Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-normal">
            Real-time biometric monitoring systems built around the <strong>Safe-Window architecture</strong>. Direct live-feed alarm relays to the <strong>Edmonton Police Service (EPS)</strong> for automated late-night business protection.
          </p>
        </div>

        {/* Dashboard Manual Controls */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 border cursor-pointer ${
              isScanning 
                ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' 
                : 'border-white/10 text-slate-500 bg-[#0c0d12]'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${isScanning ? 'animate-pulse' : ''}`} />
            {isScanning ? 'AI AGENTS ACTIVE' : 'AI AGENTS PAUSED'}
          </button>

          <button
            onClick={simulateHostileThreat}
            className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 border border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            TRIGGER LIVE COPT-ALERT
          </button>

          {threatLevelValue > 15 && (
            <button
              onClick={resetAllThreats}
              className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              CLEAR ALARMS
            </button>
          )}
        </div>
      </div>

      {/* HUD OVERVIEW PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        
        {/* COLUMN 1: LIVE CCTV SIMULATOR & PARAMETER TUNERS */}
        <div className="flex flex-col justify-between space-y-6">
          
          {/* CAMERA FEED PANEL */}
          <div className="bg-black border border-white/10 p-4 relative flex flex-col justify-between flex-1 min-h-[300px]">
            {/* Live indicator */}
            <div className="flex justify-between items-center z-10 relative">
              <div className="flex items-center gap-2 bg-black/80 px-2 py-1 border border-white/5 font-mono text-[9px]">
                <span className={`w-2 h-2 rounded-full ${isLiveFeedActive && isScanning ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
                <span className="text-white">LIVE FEED // {activeCamera}</span>
              </div>
              
              <div className="flex gap-1">
                <button 
                  onClick={() => setActiveCamera('CCTV_NORTH_PORTAL_04')}
                  className={`w-4 h-4 text-[7px] font-mono flex items-center justify-center border cursor-pointer ${activeCamera === 'CCTV_NORTH_PORTAL_04' ? 'bg-sky-500/20 text-sky-400 border-sky-400/50' : 'border-white/10 text-slate-500'}`}
                >
                  C1
                </button>
                <button 
                  onClick={() => setActiveCamera('FLIR_THERMAL_CORE_02')}
                  className={`w-4 h-4 text-[7px] font-mono flex items-center justify-center border cursor-pointer ${activeCamera === 'FLIR_THERMAL_CORE_02' ? 'bg-sky-500/20 text-sky-400 border-sky-400/50' : 'border-white/10 text-slate-500'}`}
                >
                  C2
                </button>
              </div>
            </div>

            {/* Video Canvas overlay display */}
            <div className="my-auto flex flex-col items-center justify-center relative py-8 overflow-hidden">
              {/* Scanlines visual */}
              <div className="absolute inset-0 bg-scanlines opacity-[0.03] pointer-events-none" />

              {/* Thermal color shift effect based on active camera */}
              <div className={`absolute inset-0 transition-all duration-500 pointer-events-none ${
                activeCamera === 'FLIR_THERMAL_CORE_02' 
                  ? 'bg-gradient-to-tr from-violet-950/40 via-orange-950/30 to-yellow-950/40 mix-blend-color' 
                  : 'bg-transparent'
              }`} />

              <div className="relative border border-white/5 bg-[#030406]/95 w-44 h-44 rounded-full flex items-center justify-center">
                {/* Target ring */}
                <div className="absolute inset-1 border border-dashed border-sky-500/10 rounded-full" />
                <div className="absolute inset-4 border border-white/5 rounded-full" />
                
                {/* Flashing scanner animation */}
                {isScanning && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                    className="absolute inset-0 border-t border-sky-400/30 rounded-full pointer-events-none"
                  />
                )}

                {/* Status-specific graphic core */}
                <div className="text-center z-10 space-y-1.5 font-mono">
                  {activeCamera === 'FLIR_THERMAL_CORE_02' ? (
                    <>
                      <Thermometer className="w-8 h-8 text-orange-400 mx-auto animate-pulse" />
                      <span className="text-[8px] text-orange-400 block font-bold">LWIR CORE ACTIVE</span>
                      <span className="text-[7px] text-slate-500 block">TEMP: 36.6°C AVG</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className={`w-9 h-9 mx-auto ${
                        threatLevelValue > 70 
                          ? 'text-red-500 animate-bounce' 
                          : 'text-sky-400 animate-pulse'
                      }`} />
                      <span className="text-[8px] text-white block font-bold">AI FACIAL GRID</span>
                      <span className="text-[7px] text-slate-500 block">SENSORS ARMED</span>
                    </>
                  )}
                </div>

                {/* Animated sonar coordinate tags */}
                {isScanning && (
                  <motion.div 
                    animate={{ y: [-15, 15, -15], x: [-15, 15, -15] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className="absolute w-2 h-2 rounded-full bg-rose-500 border border-white"
                  />
                )}
              </div>
            </div>

            {/* Quick Calibration HUD Panel */}
            <div className="bg-zinc-950/80 p-2.5 border border-white/5 mt-2 font-mono text-[8px] grid grid-cols-2 gap-2 text-slate-400">
              <div>
                <span>SCANNED TODAY</span>
                <span className="block text-xs font-bold text-white mt-0.5">{scannedCount}</span>
              </div>
              <div>
                <span>UNIDENTIFIED PROFILE</span>
                <span className="block text-xs font-bold text-rose-400 mt-0.5">{unidentifiedCount}</span>
              </div>
            </div>
          </div>

          {/* PARAMETER CONTROL BAR */}
          <div className="bg-zinc-900/30 border border-white/10 p-5 space-y-4 font-mono">
            <h4 className="text-[9.5px] uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              Dynamic Thresholds
            </h4>

            {/* Slider: Sensitivity */}
            <div className="space-y-1">
              <div className="flex justify-between text-[8px]">
                <span className="text-slate-400">AI AGENT SENSITIVITY</span>
                <span className="text-white font-bold">{aiSensitivity}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={aiSensitivity}
                onChange={(e) => setAiSensitivity(Number(e.target.value))}
                className="w-full accent-rose-400 bg-white/5 h-1 rounded-none cursor-pointer"
              />
            </div>

            {/* Simulated Live threat meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-[8px]">
                <span className="text-slate-400">CURRENT THREAT LEVEL</span>
                <span className={`font-bold ${threatLevelValue > 70 ? 'text-red-400' : 'text-sky-400'}`}>
                  {threatLevelValue}% ({threatLevelValue > 70 ? 'CRITICAL' : 'SAFE'})
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 relative overflow-hidden">
                <motion.div 
                  className={`h-full ${threatLevelValue > 70 ? 'bg-red-500' : 'bg-sky-400'}`}
                  animate={{ width: `${threatLevelValue}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 2: FACIAL RECOGNITION ACTIVITY LOG */}
        <div className="bg-zinc-950 border border-white/10 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2 border-b border-white/5 pb-3">
              <Fingerprint className="w-4 h-4 text-rose-400" />
              Facial Recognition Capture Log
            </h3>

            {/* List of Captured profiles */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {faces.map((face) => (
                  <motion.div
                    key={face.id}
                    initial={{ opacity: 0, x: -10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-3 border flex items-center justify-between transition-all ${
                      face.threatLevel === 'high' 
                        ? 'border-red-500/50 bg-red-500/[0.03]' 
                        : face.threatLevel === 'medium' 
                        ? 'border-amber-500/30 bg-amber-500/[0.01]' 
                        : 'border-white/5 bg-[#07080c]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar Profile frame Mock */}
                      <div className={`w-8 h-8 rounded-none border flex items-center justify-center font-mono text-[9px] font-bold ${
                        face.threatLevel === 'high' 
                          ? 'bg-red-500/10 border-red-500 text-red-400' 
                          : face.threatLevel === 'medium' 
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400' 
                          : 'bg-sky-500/5 border-sky-950 text-sky-400'
                      }`}>
                        {face.genderEstimate[0]}{face.avatarSeed % 10}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-white font-bold">{face.id}</span>
                          <span className={`text-[7px] font-mono uppercase px-1.5 py-0.5 border font-bold ${
                            face.status === 'Flagged'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
                              : face.status === 'Anonymous'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {face.status}
                          </span>
                        </div>
                        <p className="text-[8.5px] text-slate-500">
                          Estimated: {face.genderEstimate} ({face.ageRange} yrs) // Conf: {face.confidence}%
                        </p>
                      </div>
                    </div>

                    <span className="text-[8px] font-mono text-slate-600 self-start mt-0.5">{face.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-[#030406] p-3 border border-white/5 mt-4 font-mono text-[8.5px] text-slate-400 flex items-start gap-2">
            <Database className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <p>
              Scanning loops match facial features in under 40ms against locally synchronized security caches. Biometric telemetry remains entirely offline until a critical lockdown threshold triggers police dispatch.
            </p>
          </div>
        </div>

        {/* COLUMN 3: BIOMETRIC SCAN ACTIVITY LOG */}
        <div className="bg-zinc-950 border border-white/10 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2 border-b border-white/5 pb-3">
              <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
              Biometric Scan Activity
            </h3>

            {/* List of Biometric Logs */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {biometricLogs.map((bio) => {
                  const isNormal = bio.status === 'normal';
                  const isNotice = bio.status === 'notice';
                  const isFlagged = bio.status === 'flagged';
                  return (
                    <motion.div
                      key={bio.id}
                      initial={{ opacity: 0, x: -10, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-3 border flex flex-col gap-1 transition-all ${
                        isFlagged
                          ? 'border-red-500/50 bg-red-500/[0.03]'
                          : isNotice
                          ? 'border-amber-500/30 bg-amber-500/[0.01]'
                          : 'border-white/5 bg-[#07080c]/60'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[7px] font-mono uppercase px-1.5 py-0.5 border font-bold flex items-center gap-1 bg-zinc-900 border-white/10 text-slate-300">
                          {bio.sensorType === 'thermal' && <Thermometer className="w-2.5 h-2.5 text-orange-400" />}
                          {bio.sensorType === 'object' && <Layers className="w-2.5 h-2.5 text-purple-400" />}
                          {bio.sensorType === 'proximity' && <Wifi className="w-2.5 h-2.5 text-sky-400" />}
                          {bio.sensorType === 'biometric' && <Fingerprint className="w-2.5 h-2.5 text-rose-400" />}
                          {bio.sensorType}
                        </span>
                        <span className="text-[8px] font-mono text-slate-500">{bio.timestamp}</span>
                      </div>

                      <div className="flex justify-between items-end gap-2 mt-1">
                        <p className="text-[9px] text-slate-300 leading-snug">{bio.description}</p>
                        <span className={`text-[10px] font-mono font-bold shrink-0 ${
                          isFlagged ? 'text-red-400' : isNotice ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {bio.value}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-[#030406] p-3 border border-white/5 mt-4 font-mono text-[8.5px] text-slate-400 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Simulating multi-sensor verification arrays. Real-time neural threat pattern checks evaluate thermal, spatial, and object anomalies with continuous state outputs.
            </p>
          </div>
        </div>

        {/* COLUMN 4: EDMONTON POLICE SERVICE (EPS) LINK & THREAT EVENT LOGGER */}
        <div className="bg-zinc-950 border border-white/10 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* EPS Direct link status indicator block */}
            <div className="bg-[#06080e] border border-white/5 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Siren className={`w-4 h-4 ${
                    epsStatus === 'alert' ? 'text-red-500 animate-bounce' : 'text-sky-400'
                  }`} />
                  <span className="text-xs font-mono uppercase text-slate-200 font-bold">EPS DIRECT LINK</span>
                </div>

                <div className="flex items-center gap-1 bg-black px-2 py-0.5 border border-white/5 text-[8.5px] font-mono">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    epsStatus === 'online' ? 'bg-emerald-500' :
                    epsStatus === 'standby' ? 'bg-amber-400 animate-pulse' :
                    epsStatus === 'alert' ? 'bg-red-500 animate-ping' : 'bg-slate-600'
                  }`} />
                  <span className="uppercase text-slate-300">
                    {epsStatus}
                  </span>
                </div>
              </div>

              {/* EPS dispatch telemetry */}
              <div className="grid grid-cols-2 gap-2 text-[8px] font-mono text-slate-500">
                <div>
                  <span>CONNECTION:</span>
                  <span className="block text-white font-bold text-[9px]">ENCRYPTED PRIORITY</span>
                </div>
                <div>
                  <span>LATENCY:</span>
                  <span className="block text-white font-bold text-[9px]">
                    {epsStatus === 'offline' ? 'N/A' : '14ms SLA'}
                  </span>
                </div>
                <div>
                  <span>EPS POLICE STATION:</span>
                  <span className="block text-white font-bold text-[9px]">DIVISION EAST</span>
                </div>
                <div>
                  <span>POLICE RESPONDER:</span>
                  <span className="block text-rose-400 font-bold text-[9px] uppercase">
                    {epsStatus === 'alert' ? 'CRUISER 304 (ETA 1M)' : 'MONITORING STANDBY'}
                  </span>
                </div>
              </div>

              {/* Secure payload telemetry output */}
              {epsStatus === 'alert' && (
                <div className="bg-red-500/5 border border-red-500/20 p-2.5 font-mono text-[8px] text-red-400 animate-pulse leading-normal">
                  <strong>CRITICAL_ALERT:</strong> Compressed 10-second facial posture buffer uploaded to Edmonton Police central CAD terminal under token ID: <strong>EPS-99128A</strong>
                </div>
              )}
            </div>

            {/* REAL-TIME LOG SCREEN */}
            <div className="space-y-2">
              <h4 className="text-[9px] uppercase font-mono tracking-wider text-slate-500 font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 text-sky-400" />
                AI AGENT REAL-TIME LOG FEED
              </h4>

              <div className="bg-[#030406] border border-white/5 p-3 rounded-none font-mono text-[8.5px] space-y-2 max-h-[220px] overflow-y-auto leading-tight text-slate-400">
                <AnimatePresence initial={false}>
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-white/[0.02] pb-1.5"
                    >
                      <div className="flex justify-between text-slate-500 text-[7px] mb-0.5">
                        <span>[{log.timestamp}] // {log.agent}</span>
                        <span className={`uppercase font-bold ${
                          log.type === 'critical' ? 'text-red-400' :
                          log.type === 'warning' ? 'text-amber-400' :
                          log.type === 'success' ? 'text-emerald-400' : 'text-sky-400'
                        }`}>{log.type}</span>
                      </div>
                      <p className="text-slate-300 leading-normal">{log.event}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[8.5px] font-mono text-slate-500">
            <span>UPLINK HEARTBEAT STATE: EXCELLENT</span>
            <span>SECURE PRIORITY LINE v4.19</span>
          </div>

        </div>

      </div>

      {/* LOWER ARCHITECTURAL NOTES CARD */}
      <div className="mt-8 bg-zinc-900/40 border border-white/5 p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="space-y-1">
          <span className="text-[8px] font-mono uppercase text-sky-400 font-bold tracking-wider block">Neighborhood Continuity Guarantee</span>
          <p className="text-[11px] text-slate-300">
            By deploying this AI-monitored <strong>Smart Portal</strong>, SafeMart ensures cashiers never feel unsafe during night hours, completely eliminating armed robbery incentives. Employees stay completely protected, while residents preserve access to 24/7 priority essentials.
          </p>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-[9px] font-bold uppercase shrink-0 border border-emerald-500/20 bg-emerald-500/15 px-3 py-1.5">
          <ShieldCheck className="w-4 h-4" />
          Underwritten Safe-Zone Approved
        </div>
      </div>

    </motion.section>
  );
};
