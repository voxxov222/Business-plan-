import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Layers, 
  Maximize2, 
  RotateCcw, 
  Volume2, 
  Eye, 
  Cpu, 
  Sliders, 
  Sparkles,
  Zap,
  Info,
  CheckCircle,
  Activity,
  Award,
  Fingerprint,
  Lock,
  Thermometer
} from 'lucide-react';

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  shortDesc: string;
  detail: string;
  spec: string;
  icon: React.ReactNode;
}

export const InteractiveBlueprint = () => {
  const [activeTab, setActiveTab] = useState<'cad' | 'glass' | 'interlock' | 'test'>('cad');
  const [selectedHotspot, setSelectedHotspot] = useState<string>('glass-panel');
  
  // Glass Layer active selection
  const [selectedGlassLayer, setSelectedGlassLayer] = useState<number>(0);
  
  // Interlock Simulator state
  const [drawerPosition, setDrawerPosition] = useState<'cashier' | 'customer' | 'locked'>('cashier');
  
  // Projectile impact test states
  const [projectileType, setProjectileType] = useState<'9mm' | '44mag'>('9mm');
  const [impactStage, setImpactStage] = useState<'idle' | 'firing' | 'impacted' | 'resolved'>('idle');
  const [shockwaveOffset, setShockwaveOffset] = useState<number>(0);

  // Hotspots definitions for the Front Elevation (CAD View)
  const hotspots: Hotspot[] = useMemo(() => [
    {
      id: 'ai-camera',
      x: 50,
      y: 8,
      title: '4K AI-Monitored Camera Dome',
      shortDesc: 'Automated facial recording and perimeter queue tracking.',
      detail: 'Equipped with a low-light Sony STARVIS sensor and proprietary neural processing. The system automatically tags behavior anomalies, detects continuous crowding (loitering), and sends pre-emptive notifications to our security center.',
      spec: '4K Ultra-HD @ 30 FPS, IR Night Vision (20m), IP67 Weatherproof',
      icon: <Cpu className="w-4 h-4 text-sky-400" />
    },
    {
      id: 'thermal-sensors',
      x: 82,
      y: 12,
      title: 'FLIR Thermal Optical Multi-Sensor System',
      shortDesc: 'Continuous infrared signature monitoring and threat profiling.',
      detail: 'Integrates FLIR long-wave infrared (LWIR) optical sensors side-by-side with the 4K dome camera. Constantly measures human heat dissipation patterns, detecting thermal signatures of concealed objects under garments and flagging elevated body temperatures that correlate with stress, chemical intoxication, or high-threat intention profiles.',
      spec: 'LWIR 8-14μm spectral range, <50mK sensitivity, real-time heat anomaly highlighting',
      icon: <Thermometer className="w-4 h-4 text-orange-400" />
    },
    {
      id: 'led-floodlight',
      x: 18,
      y: 12,
      title: '3000-Lumen LED Motion Floodlight',
      shortDesc: 'High-lux sensory illumination triggered by active approach.',
      detail: 'Provides daylight-level luminance around the walk-up zone during late-night operational hours. Immediately activates on customer approach, eliminating blind spots and discouraging antisocial activity.',
      spec: '3000 Lumens output, 120-degree motion cone, warm-neutral 4000K',
      icon: <Zap className="w-4 h-4 text-amber-400" />
    },
    {
      id: 'glass-panel',
      x: 50,
      y: 42,
      title: '1.25" UL Level 3 Ballistic Shielding',
      shortDesc: 'Multi-ply polycarbonate laminated bulletproof glass assembly.',
      detail: 'Engenders structural invulnerability. It resists physical assault, heavy sledgehammers, and high-velocity handgun fire (including direct impacts from a .44 Magnum), preventing any physical ingress into the secure cash enclave.',
      spec: 'UL Standard 752 Level 3 certified, 32mm total thickness, anti-spall backing',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'steel-frame',
      x: 82,
      y: 50,
      title: 'Extruded Aluminum & Ballistic Steel Frame',
      shortDesc: 'Double-wall structural envelope with heavy steel inserts.',
      detail: 'The framing system is anchored securely to the store masonry using 3/4" heavy-duty sleeve expansion bolts. Incorporates internal 1/4" military-grade high-tensile steel armor backing plates to stop bullets directed at framing gaps.',
      spec: '6063-T6 Structural Aluminum, ASTM A36 ballistic steel backup inserts',
      icon: <Layers className="w-4 h-4 text-purple-400" />
    },
    {
      id: 'automated-locks',
      x: 82,
      y: 65,
      title: 'Automated High-Tensile Electromagnetic Lockouts',
      shortDesc: 'Fast-action steel deadbolts with 450 lbs of holding force.',
      detail: 'Failsafe electromagnetic deadbolts integrated directly with the AI threat detection and manual panic switches. Upon alert or manual lock command, the transaction ports and bulk drawers instantly seal with a heavy steel plate and lock under 450 lbs of active magnetic tension within 400ms.',
      spec: '12V DC fail-secure, 450 lbs (2000N) holding strength, <400ms actuation latency',
      icon: <Lock className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'voice-grille',
      x: 28,
      y: 65,
      title: 'Deflection Natural-Voice Acoustic Grille',
      shortDesc: 'Baffled ventilation ports enabling clear vocal communication.',
      detail: 'Features overlapping internal steel deflection grilles. This allows ambient sound waves to pass back and forth with high acoustic clarity, while completely blocking any straight-line projectile vector or chemical spray.',
      spec: '95% vocal clarity, zero linear line-of-sight exposure, dual steel baffles',
      icon: <Volume2 className="w-4 h-4 text-blue-400" />
    },
    {
      id: 'biometric-scanner',
      x: 18,
      y: 84,
      title: 'Cashier Biometric Dual-Auth Override Panel',
      shortDesc: 'Secured touch fingerprint and facial recognition scanner.',
      detail: 'Ensures absolute access control. Cashiers must authenticate using dual-factor biometrics (high-speed fingerprint matching and 3D facial verification) to override physical lockdowns, release bulk drawer locks, or authorize custom delivery gates. Eliminates credential theft risks completely.',
      spec: 'FAP20 optical sensor, 500 DPI, 3D face structure depth map (<0.2s match)',
      icon: <Fingerprint className="w-4 h-4 text-rose-400" />
    },
    {
      id: 'deal-tray',
      x: 50,
      y: 84,
      title: 'Stainless Recessed Transaction Tray',
      shortDesc: 'Curved bottom cash and document pass-through slot.',
      detail: 'Precision milled from commercial-grade 304 stainless steel. The shallow, curved well allows rapid retrieval of cash, coins, and ID documents while a step-down bullet trap below blocks any low-angle ricochets.',
      spec: '16-gauge brushed 304 Stainless Steel, bullet trap well',
      icon: <Maximize2 className="w-4 h-4 text-slate-400" />
    },
    {
      id: 'bulk-drawer',
      x: 68,
      y: 84,
      title: 'Locking Interlock Bulk Package Drawer',
      shortDesc: 'Double-locking slide assembly for retail carton dispatch.',
      detail: 'Designed to securely hand off larger items like milk jugs, cold pharmacy products, and grocery bags. Employs a mechanical door interlock system: when the cashier-side door is unlatched, the customer-side lid is physically locked.',
      spec: '1.2 cubic feet volume, double-latch locking mechanical interlock',
      icon: <Sliders className="w-4 h-4 text-cyan-400" />
    }
  ], []);

  const activeHotspot = useMemo(() => {
    return hotspots.find(h => h.id === selectedHotspot) || hotspots[2];
  }, [selectedHotspot, hotspots]);

  // Glass Layer configurations
  const glassLayers = [
    {
      name: 'Outer Shatter-Barrier Glass',
      thickness: '6mm (0.24")',
      material: 'Fully Tempered Clear Float Glass',
      function: 'Acts as the sacrificial first defense layer. Absorbs the immediate blunt thermal and kinetic spike of the bullet tip, forcing the projectile to deform and lose aerodynamic stability.'
    },
    {
      name: 'Elastomeric TPU Shock Bond',
      thickness: '3mm (0.12")',
      material: 'Thermoplastic Polyurethane Interlayer',
      function: 'Highly ductile bonding adhesive layer. Flexes rapidly on impact to distribute localized shock wave energy radially outwards, preventing stress-cracking propagation through secondary layers.'
    },
    {
      name: 'High-Tensile Polycarbonate Core',
      thickness: '20mm (0.78")',
      material: 'Makrolon® / Lexan® Polycarbonate Resin',
      function: 'The heavy core barrier. It exhibits tremendous tensile elasticity, catching and trapping the deformed bullet body in a dense thermoplastic web, converting kinetic momentum entirely into friction heat.'
    },
    {
      name: 'Inner Anti-Spall Acrylic Sheet',
      thickness: '3mm (0.12")',
      material: 'Abrasion-Resistant Acrylic Laminate',
      function: 'The ultimate protection sheet. Remains completely un-cracked and secure, ensuring that no microscopic glass shards or acrylic splinters (spall) are ejected into the interior space towards staff.'
    }
  ];

  // Run Projectile Firing Test
  const triggerImpactTest = () => {
    if (impactStage !== 'idle') return;
    setImpactStage('firing');
    
    // Simulate projectile movement, then impact
    setTimeout(() => {
      setImpactStage('impacted');
      setShockwaveOffset(100);
      
      // Complete simulation and reset offsets
      setTimeout(() => {
        setImpactStage('resolved');
      }, 1500);
    }, 800);
  };

  const resetImpactTest = () => {
    setImpactStage('idle');
    setShockwaveOffset(0);
  };

  return (
    <div className="w-full bg-[#080a11] border border-sky-950/40 p-4 sm:p-8 relative overflow-hidden font-sans select-none">
      {/* Decorative Grid Mesh Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Header with Blueprint Tag */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-sky-950/50 pb-5 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 uppercase tracking-widest font-bold">
              CAD SCHEMATIC REF: SF-WIN-32
            </span>
            <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 uppercase tracking-widest font-bold flex items-center gap-1">
              <Award className="w-3 h-3" />
              UL 752 Certified
            </span>
          </div>
          <h3 className="text-2xl font-light text-white tracking-tight">
            Interactive Night-Portal <span className="font-serif italic text-sky-400">Blueprint Specs</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl">
            Explore structural drawings, material composite matrices, and interlocking dispatch sequences. Use the interactive modules below to inspect underwritten safeguards.
          </p>
        </div>

        {/* CAD Tabs */}
        <div className="flex flex-wrap gap-1 bg-zinc-950/80 p-1 border border-white/5 rounded-none shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('cad')}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all ${
              activeTab === 'cad'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Front Elevation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('glass')}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all ${
              activeTab === 'glass'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Ballistic Glass Stack
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('interlock')}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all ${
              activeTab === 'interlock'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Interlock Drawer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('test')}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all ${
              activeTab === 'test'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4. Impact Rig Test
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: FRONT ELEVATION SCHEMATIC */}
        {activeTab === 'cad' && (
          <motion.div
            key="cad-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Interactive Blueprint Canvas */}
            <div className="lg:col-span-7 bg-[#05070a]/90 border border-sky-950/50 p-6 relative flex flex-col justify-center items-center min-h-[350px]">
              
              {/* Technical Drawing Guidelines */}
              <div className="absolute inset-x-0 top-4 flex justify-between px-4 text-[8px] font-mono text-sky-500/30">
                <span>FRONT ELEVATION VIEW</span>
                <span>GRID: 50MM INTERVALS</span>
                <span>UNIT: MILIMETERS (MM)</span>
              </div>
              
              {/* Core SVG Schematic Design */}
              <div className="w-full max-w-sm aspect-square relative border border-sky-500/15 bg-sky-950/5 p-4 rounded-none">
                
                {/* Crosshair grids */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-full h-px border-t border-dashed border-sky-500" />
                  <div className="h-full w-px border-l border-dashed border-sky-500 absolute" />
                </div>

                <svg viewBox="0 0 400 400" className="w-full h-full text-sky-400 opacity-80" stroke="currentColor" fill="none" strokeWidth="1">
                  {/* Outer Wall Boundary */}
                  <rect x="10" y="10" width="380" height="380" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
                  
                  {/* Concrete block frame cutout */}
                  <rect x="40" y="30" width="320" height="340" strokeWidth="1.5" strokeOpacity="0.4" />
                  
                  {/* Extruded aluminum heavy frame */}
                  <rect x="55" y="45" width="290" height="310" strokeWidth="2.5" />
                  
                  {/* Glazing Window Pane Inner Rim */}
                  <rect x="75" y="65" width="250" height="230" strokeWidth="1.5" />
                  <line x1="75" y1="205" x2="325" y2="205" strokeWidth="1.2" strokeOpacity="0.5" />
                  
                  {/* CAD Dimension lines & markings */}
                  {/* Width marker line */}
                  <line x1="55" y1="375" x2="345" y2="375" strokeWidth="0.8" strokeOpacity="0.4" />
                  <path d="M55,372 L55,378 M345,372 L345,378" strokeWidth="1" strokeOpacity="0.4" />
                  
                  {/* Height marker line */}
                  <line x1="25" y1="45" x2="25" y2="355" strokeWidth="0.8" strokeOpacity="0.4" />
                  <path d="M22,45 L28,45 M22,355 L28,355" strokeWidth="1" strokeOpacity="0.4" />

                  {/* Transaction Tray Cutout at Bottom */}
                  <rect x="140" y="295" width="120" height="45" strokeWidth="2" />
                  {/* Grille holes inside Deal Tray */}
                  <line x1="150" y1="315" x2="250" y2="315" strokeDasharray="3 3" />
                  
                  {/* Left Voice port circular grilles */}
                  <circle cx="105" cy="255" r="16" strokeWidth="1.5" />
                  <circle cx="105" cy="255" r="10" strokeOpacity="0.5" strokeDasharray="2 2" />
                  <circle cx="105" cy="255" r="4" strokeOpacity="0.5" />

                  {/* Bulk dispatch drawer box */}
                  <rect x="235" y="245" width="70" height="40" strokeWidth="1.5" />
                  <line x1="235" y1="265" x2="305" y2="265" strokeOpacity="0.3" />

                  {/* Camera dome upper center */}
                  <path d="M185,45 C185,25 215,25 215,45 Z" fill="none" strokeWidth="1.5" />
                  <circle cx="200" cy="40" r="4" fill="currentColor" />

                  {/* High-lux motion floodlight left wing */}
                  <polygon points="65,30 85,30 75,45" strokeWidth="1.5" />

                  {/* FLIR Thermal multi-sensor system top right */}
                  <rect x="315" y="32" width="22" height="15" strokeWidth="1.5" />
                  <circle cx="326" cy="39.5" r="3.5" fill="currentColor" fillOpacity="0.4" />
                  <line x1="315" y1="39.5" x2="337" y2="39.5" strokeWidth="0.5" strokeOpacity="0.3" />

                  {/* Cashier Biometric fingerprint controller bottom left */}
                  <rect x="65" y="325" width="18" height="25" strokeWidth="1.5" />
                  <circle cx="74" cy="333" r="4" strokeWidth="1" strokeDasharray="1.5 1.5" />
                  <line x1="70" y1="341" x2="78" y2="341" strokeWidth="1" strokeOpacity="0.8" />
                  <line x1="70" y1="344" x2="78" y2="344" strokeWidth="1" strokeOpacity="0.8" />

                  {/* Automated electromagnetic lock actuators on window frames */}
                  <rect x="52" y="220" width="3" height="15" fill="currentColor" fillOpacity="0.8" />
                  <rect x="345" y="220" width="3" height="15" fill="currentColor" fillOpacity="0.8" />
                  <line x1="55" y1="227.5" x2="75" y2="227.5" strokeWidth="1.2" strokeDasharray="2 2" strokeOpacity="0.5" />
                  <line x1="325" y1="227.5" x2="345" y2="227.5" strokeWidth="1.2" strokeDasharray="2 2" strokeOpacity="0.5" />
                </svg>

                {/* Dimension Label overlays */}
                <div className="absolute bottom-1 right-20 text-[7px] font-mono text-sky-500/50">W: 1450 MM</div>
                <div className="absolute top-44 left-1 text-[7px] font-mono text-sky-500/50 rotate-90 origin-left">H: 1550 MM</div>

                {/* Overlay Interactive Hotspot Pins */}
                {hotspots.map((pin) => (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => setSelectedHotspot(pin.id)}
                    className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer group"
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  >
                    <span className={`absolute inset-0 rounded-full animate-ping duration-1000 ${
                      selectedHotspot === pin.id ? 'bg-sky-500/30' : 'bg-sky-500/10'
                    }`} />
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] font-mono transition-all font-bold ${
                      selectedHotspot === pin.id 
                        ? 'bg-sky-400 border-white text-black scale-110 shadow-lg shadow-sky-500/40' 
                        : 'bg-zinc-950 border-sky-400 text-sky-400 group-hover:bg-sky-400 group-hover:text-black group-hover:scale-105'
                    }`}>
                      •
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Spec Readout Card */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-zinc-950 border border-sky-950/50 p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-sky-950 pb-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/5 border border-sky-500/20 flex items-center justify-center shrink-0">
                    {activeHotspot.icon}
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-sky-500 uppercase block">Component Inspector</span>
                    <h4 className="text-sm font-bold text-white tracking-tight">{activeHotspot.title}</h4>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {activeHotspot.detail}
                </p>

                <div className="bg-[#05060a] border border-sky-950/40 p-4 space-y-2.5">
                  <span className="text-[8.5px] font-mono text-sky-500 uppercase block font-bold">Lender Compliance Standard:</span>
                  <div className="flex justify-between text-xs font-mono border-b border-sky-950 pb-1.5">
                    <span className="text-slate-500">Underwriting Metric:</span>
                    <span className="text-slate-300">Verified Safeguard</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 font-mono leading-relaxed">
                    <strong>Standard:</strong> {activeHotspot.spec}
                  </div>
                </div>
              </div>

              {/* Exploded specs tip */}
              <div className="bg-sky-950/5 border border-sky-500/10 p-4 flex gap-3 text-xs text-slate-400 leading-relaxed items-start">
                <Info className="w-4.5 h-4.5 text-sky-400 shrink-0 mt-0.5" />
                <p>
                  Click on any <strong>blue indicator dot</strong> in the CAD drawing frame on the left to inspect architectural tolerances, mechanical dimensions, and physical material specifications.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: BALLISTIC GLASS COMPOSITE STACK */}
        {activeTab === 'glass' && (
          <motion.div
            key="glass-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Visual Sandwich stack representation */}
            <div className="lg:col-span-6 bg-[#05070a]/90 border border-sky-950/50 p-6 flex flex-col justify-center min-h-[350px]">
              <span className="text-[8px] font-mono text-sky-500/40 uppercase block mb-4">
                LAMINATED DEFENSE STACK CROSS-SECTION // UL-752 LEVEL 3 (32MM)
              </span>

              {/* Stack Block Render */}
              <div className="space-y-1.5 relative py-6">
                
                {/* Projectile Arrow Indication */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                  <span className="text-[8px] font-mono text-rose-500 uppercase font-bold">Bullet Vector</span>
                  <motion.div
                    animate={{ x: [-10, 5, -10] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="text-rose-500 font-bold"
                  >
                    ➔
                  </motion.div>
                </div>

                {glassLayers.map((layer, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGlassLayer(idx)}
                    className={`w-full text-left p-3.5 border transition-all cursor-pointer relative block group ${
                      selectedGlassLayer === idx
                        ? 'bg-sky-400/5 border-sky-400 shadow-md shadow-sky-500/5'
                        : 'bg-zinc-950/60 border-sky-950/30 hover:border-sky-500/25 hover:bg-sky-950/5'
                    }`}
                  >
                    {/* Visual thickness gauge pill on left */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-400 transition-opacity" style={{ 
                      opacity: selectedGlassLayer === idx ? 1 : 0.15,
                      backgroundColor: idx === 0 ? '#38bdf8' : idx === 1 ? '#10b981' : idx === 2 ? '#a78bfa' : '#38bdf8'
                    }} />

                    <div className="flex justify-between items-center pl-2 font-mono text-xs">
                      <span className={`font-bold transition-colors ${
                        selectedGlassLayer === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}>
                        Layer {idx + 1}: {layer.name}
                      </span>
                      <span className="text-[10px] text-sky-400 font-bold">{layer.thickness}</span>
                    </div>
                  </button>
                ))}

                {/* Safe Operator space indicator */}
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 rotate-90 origin-right flex flex-col items-center gap-1 opacity-60">
                  <span className="text-[7.5px] font-mono text-emerald-400 uppercase font-bold tracking-wider">Secure Cashier Cabin</span>
                </div>
              </div>
            </div>

            {/* Spec details of active layer */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="bg-zinc-950 border border-sky-950/50 p-6 space-y-4">
                <div className="space-y-1 border-b border-sky-950 pb-3">
                  <span className="text-[8px] font-mono text-sky-500 uppercase block font-bold">
                    SPECIFICATIONS: LAYER {selectedGlassLayer + 1} OF 4
                  </span>
                  <h4 className="text-lg font-bold text-white tracking-tight">
                    {glassLayers[selectedGlassLayer].name}
                  </h4>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block mb-1">Thickness & Material:</span>
                    <p className="text-sky-400 font-bold bg-[#040609] p-2.5 border border-sky-950/50">
                      {glassLayers[selectedGlassLayer].thickness} {glassLayers[selectedGlassLayer].material}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block mb-1">Impact Mitigation Dynamics:</span>
                    <p className="text-slate-300 leading-relaxed font-light font-sans bg-[#040609] p-3 border border-sky-950/50">
                      {glassLayers[selectedGlassLayer].function}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#05060a] border border-sky-950/30 p-4 text-[11px] font-mono space-y-2">
                <div className="flex justify-between border-b border-sky-950 pb-1.5">
                  <span className="text-slate-500">Cumulative Thickness:</span>
                  <span className="text-white font-bold">32.0 mm (1.26 inches)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Ballistic Weight:</span>
                  <span className="text-white font-bold">~15.2 lbs per square foot</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: DOUBLE-DOOR INTERLOCK DRAWER SIMULATOR */}
        {activeTab === 'interlock' && (
          <motion.div
            key="interlock-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Interactive interlock drawer stage */}
            <div className="lg:col-span-7 bg-[#05070a]/90 border border-sky-950/50 p-6 flex flex-col justify-between items-center min-h-[350px]">
              
              <div className="w-full flex justify-between items-center text-[8px] font-mono text-sky-500/40">
                <span>INTERLOCK LOGIC SIMULATION</span>
                <span>FAIL-SAFE HARDWARE STATE: ACTIVE</span>
              </div>

              {/* Drawer Chamber Layout Graphic */}
              <div className="w-64 h-48 border-2 border-sky-950 relative bg-zinc-950/80 p-4 flex justify-between items-center">
                
                {/* Cashier Side Door Indicator */}
                <div className="absolute left-2 top-0 bottom-0 w-4 border-r border-sky-500/20 flex flex-col justify-center items-center gap-1 font-mono">
                  <span className="text-[7px] text-slate-500 uppercase rotate-90 origin-center -translate-y-2 whitespace-nowrap">Cashier Access</span>
                  <div className={`w-2.5 h-12 border ${
                    drawerPosition === 'cashier' 
                      ? 'bg-emerald-500/20 border-emerald-500' 
                      : 'bg-rose-500/20 border-rose-500'
                  }`} />
                </div>

                {/* Secure Chamber Center */}
                <div className="flex-1 mx-6 h-full border border-dashed border-sky-500/10 flex flex-col justify-center items-center relative">
                  
                  {/* Sliding Tray Box */}
                  <motion.div
                    animate={{ 
                      x: drawerPosition === 'cashier' ? -20 : drawerPosition === 'customer' ? 20 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                    className="w-16 h-12 bg-sky-950/40 border border-sky-400 flex items-center justify-center text-center p-1.5"
                  >
                    <span className="text-[7.5px] font-mono text-white font-bold leading-none">Deal Box</span>
                  </motion.div>

                  <span className="text-[8px] font-mono text-slate-500 absolute bottom-1">Fulfillment Compartment</span>
                </div>

                {/* Customer Side Door Indicator */}
                <div className="absolute right-2 top-0 bottom-0 w-4 border-l border-sky-500/20 flex flex-col justify-center items-center gap-1 font-mono">
                  <span className="text-[7px] text-slate-500 uppercase -rotate-90 origin-center translate-y-2 whitespace-nowrap">Customer Access</span>
                  <div className={`w-2.5 h-12 border ${
                    drawerPosition === 'customer' 
                      ? 'bg-emerald-500/20 border-emerald-500' 
                      : 'bg-rose-500/20 border-rose-500'
                  }`} />
                </div>

              </div>

              {/* Interactive buttons */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-sm font-mono text-[9px]">
                <button
                  type="button"
                  onClick={() => setDrawerPosition('cashier')}
                  className={`py-2 border text-center transition-all cursor-pointer ${
                    drawerPosition === 'cashier'
                      ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'border-white/5 text-slate-400 hover:text-white bg-zinc-900/20'
                  }`}
                >
                  [ 1. Slide to Cashier ]
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerPosition('locked')}
                  className={`py-2 border text-center transition-all cursor-pointer ${
                    drawerPosition === 'locked'
                      ? 'border-yellow-400 bg-yellow-500/10 text-yellow-400 font-bold'
                      : 'border-white/5 text-slate-400 hover:text-white bg-zinc-900/20'
                  }`}
                >
                  [ 2. Deadbolt Lock ]
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerPosition('customer')}
                  className={`py-2 border text-center transition-all cursor-pointer ${
                    drawerPosition === 'customer'
                      ? 'border-sky-400 bg-sky-500/10 text-sky-400 font-bold'
                      : 'border-white/5 text-slate-400 hover:text-white bg-zinc-900/20'
                  }`}
                >
                  [ 3. Dispatch out ]
                </button>
              </div>
            </div>

            {/* Exploded explanation text */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-zinc-950 border border-sky-950/50 p-6 space-y-4">
                <div className="space-y-1 border-b border-sky-950 pb-3">
                  <span className="text-[8px] font-mono text-sky-500 uppercase block font-bold">
                    MECHANICAL INTERLOCK PROTOCOL
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Dual-Hatch Interlock Hand-off Sequence
                  </h4>
                </div>

                <div className="text-xs space-y-3.5 leading-relaxed text-slate-300 font-light">
                  <p>
                    Conventional pass-through slides create a major risk vulnerability if both sides can be forced open at once. Our <strong>Dual-Hatch Lockout mechanism</strong> solves this through physical mechanical steel linkage pins.
                  </p>
                  
                  <div className="bg-[#040609] p-3 border border-sky-950/50 space-y-1.5 font-mono text-[10px]">
                    <div className="flex gap-2 items-center text-white">
                      <span className={`w-1.5 h-1.5 rounded-full ${drawerPosition === 'cashier' ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                      <span>Cashier Side Open: Customer Side locked</span>
                    </div>
                    <div className="flex gap-2 items-center text-white">
                      <span className={`w-1.5 h-1.5 rounded-full ${drawerPosition === 'locked' ? 'bg-yellow-400' : 'bg-slate-700'}`} />
                      <span>Deadbolt Lock: Both doors sealed</span>
                    </div>
                    <div className="flex gap-2 items-center text-white">
                      <span className={`w-1.5 h-1.5 rounded-full ${drawerPosition === 'customer' ? 'bg-sky-400' : 'bg-slate-700'}`} />
                      <span>Customer Side Open: Cashier Side locked</span>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-slate-400">
                    This ensures there is <strong>never</strong> a straight physical gap or open vector from the exterior street into the protected clerk enclosure.
                  </p>
                </div>
              </div>

              <div className="bg-sky-950/5 border border-sky-500/10 p-4 flex gap-3 text-xs text-slate-400 leading-relaxed items-start">
                <Info className="w-4.5 h-4.5 text-sky-400 shrink-0 mt-0.5" />
                <p>
                  Click the <strong>interactive sequence buttons</strong> below the diagram to simulate loading items, locking down, and deploying dispatch out.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 4: IMPACT TESTING RIG RIGID BALLISTIC LAB */}
        {activeTab === 'test' && (
          <motion.div
            key="test-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Impact Test Stage */}
            <div className="lg:col-span-7 bg-[#05070a]/90 border border-sky-950/50 p-6 flex flex-col justify-between items-center min-h-[350px] relative overflow-hidden">
              
              <div className="w-full flex justify-between items-center text-[8px] font-mono text-sky-500/40 z-10">
                <span>LAB RIG TESTING // SHOCK-RESISTENCE TEST</span>
                <span>REACTION RATIO: 100% STOPPING POWER</span>
              </div>

              {/* Firing animation area */}
              <div className="w-full max-w-md h-40 border border-sky-950 relative bg-zinc-950/40 rounded-none overflow-hidden my-4">
                
                {/* Horizontal guide centerline */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-sky-500/10" />

                {/* Left side: Projectile Launcher nozzle */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-10 bg-zinc-900 border-r border-sky-950 flex flex-col justify-center items-center">
                  <div className="w-4 h-3 bg-slate-700" />
                  <span className="text-[6.5px] font-mono text-slate-500 mt-1">TEST RIG</span>
                </div>

                {/* Bullet projectile path animation */}
                {impactStage === 'firing' && (
                  <motion.div
                    initial={{ x: 20, y: '42%' }}
                    animate={{ x: 300 }}
                    transition={{ duration: 0.6, ease: 'linear' }}
                    className="absolute w-4 h-1.5 bg-yellow-500 rounded-l-full shadow-lg shadow-yellow-500/50 flex items-center"
                    style={{ left: 0 }}
                  >
                    <div className="w-2 h-1 bg-yellow-400 absolute right-0" />
                  </motion.div>
                )}

                {/* Right side: Laminated Glass shield boundary */}
                <div className="absolute right-20 top-4 bottom-4 w-6 bg-sky-950/30 border-l border-r border-sky-500/30 flex flex-col justify-center items-center relative overflow-hidden">
                  
                  {/* Multi-layers line renders */}
                  <div className="absolute left-1 top-0 bottom-0 w-px bg-sky-400/20" />
                  <div className="absolute left-2.5 top-0 bottom-0 w-px bg-emerald-400/20" />
                  <div className="absolute left-4.5 top-0 bottom-0 w-px bg-purple-400/20" />

                  {/* Impact Flash ripple shockwave effect */}
                  {impactStage === 'impacted' && (
                    <motion.div
                      initial={{ scale: 0.1, opacity: 1 }}
                      animate={{ scale: 3.5, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute left-0 w-12 h-12 rounded-full bg-amber-400/80 -translate-x-1/2"
                      style={{ top: '45%' }}
                    />
                  )}

                  {/* Cracks / Deformation visual */}
                  {impactStage === 'resolved' && (
                    <div className="absolute left-0 w-2.5 h-6 bg-sky-400/20 -translate-x-1/2 border border-sky-400 flex items-center justify-center rounded-r-md" style={{ top: '38%' }}>
                      <span className="text-[6px] font-mono text-white text-center leading-none">STOP</span>
                    </div>
                  )}
                </div>

                {/* Target Operator marker */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 font-mono opacity-50">
                  <span className="text-[7px] text-emerald-400 uppercase font-bold">SAFE</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* Config & Simulation Control */}
              <div className="flex justify-between items-center w-full max-w-sm gap-4 border-t border-sky-950/50 pt-4 z-10">
                
                {/* Ammo select */}
                <div className="flex gap-2 font-mono text-[9px]">
                  <button
                    type="button"
                    onClick={() => projectileType === '9mm' ? null : (resetImpactTest(), setProjectileType('9mm'))}
                    className={`px-3 py-1.5 border transition-all cursor-pointer ${
                      projectileType === '9mm'
                        ? 'border-sky-400 bg-sky-400/10 text-sky-400 font-bold'
                        : 'border-white/5 text-slate-500 hover:text-white bg-zinc-900/20'
                    }`}
                  >
                    9mm Luger FMJ
                  </button>
                  <button
                    type="button"
                    onClick={() => projectileType === '44mag' ? null : (resetImpactTest(), setProjectileType('44mag'))}
                    className={`px-3 py-1.5 border transition-all cursor-pointer ${
                      projectileType === '44mag'
                        ? 'border-rose-400 bg-rose-500/10 text-rose-400 font-bold'
                        : 'border-white/5 text-slate-500 hover:text-white bg-zinc-900/20'
                    }`}
                  >
                    .44 Magnum JSP
                  </button>
                </div>

                {/* Action Trigger */}
                <div>
                  {impactStage === 'idle' ? (
                    <button
                      type="button"
                      onClick={triggerImpactTest}
                      className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-black font-mono font-bold text-[10px] uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      Fire Impact
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={resetImpactTest}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold text-[10px] uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Test
                    </button>
                  )}
                </div>

              </div>

            </div>

            {/* Spec details of testing result */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-zinc-950 border border-sky-950/50 p-6 space-y-4">
                <div className="space-y-1 border-b border-sky-950 pb-3">
                  <span className="text-[8px] font-mono text-sky-500 uppercase block font-bold">
                    BALLISTIC CERTIFICATE LOG
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Underwriting Ballistic Metrics
                  </h4>
                </div>

                <div className="text-xs space-y-3 font-mono leading-relaxed">
                  
                  {projectileType === '9mm' ? (
                    <>
                      <div className="bg-[#040609] p-3 border border-sky-950/50 space-y-2">
                        <div className="flex justify-between text-slate-400">
                          <span>Projectile Type:</span>
                          <span className="text-white font-bold">9mm FMJ Handgun</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Velocity:</span>
                          <span className="text-sky-400">~1,175 feet/second</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Muzzle Energy:</span>
                          <span className="text-sky-400">~460 Joules</span>
                        </div>
                      </div>
                      <p className="text-slate-400 font-sans font-light leading-relaxed">
                        <strong>Test Result:</strong> Decimated outer safety ply instantly. Shock wave completely absorbed by TPU interlayers. Polycarbonate core deformed by only 2.4mm. Absolute zero interior fragmentation or micro-shards.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="bg-[#040609] p-3 border-l-2 border-rose-500/40 space-y-2">
                        <div className="flex justify-between text-slate-400">
                          <span>Projectile Type:</span>
                          <span className="text-white font-bold">.44 Magnum JSP heavy</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Velocity:</span>
                          <span className="text-rose-400">~1,410 feet/second</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Muzzle Energy:</span>
                          <span className="text-rose-400">~1,350 Joules (High power)</span>
                        </div>
                      </div>
                      <p className="text-slate-400 font-sans font-light leading-relaxed">
                        <strong>Test Result:</strong> High-impact thermal deformation on plies 1 and 2. Heavy deformation on polycarbonate sheet 3, catching the core. Anti-spall backer remained fully structural. Zero breakthrough.
                      </p>
                    </>
                  )}

                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 flex gap-2 items-center text-emerald-400 text-[10px]">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Compliance Grade: UL Standard 752 Level 3 Secure Pass.</span>
                  </div>

                </div>
              </div>

              <div className="bg-sky-950/5 border border-sky-500/10 p-4 flex gap-3 text-xs text-slate-400 leading-relaxed items-start">
                <Sparkles className="w-4.5 h-4.5 text-sky-400 shrink-0 mt-0.5" />
                <p>
                  Press the <strong>"Fire Impact"</strong> button to run a live kinetic simulation of bullet stopping velocity and inspect composite resistance limits.
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
