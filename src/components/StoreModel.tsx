import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Text, Plane, Environment, ContactShadows, useCursor, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Shield, Hammer, DollarSign, Sparkles, AlertCircle, TrendingUp, Cpu, Flame, ListFilter, ClipboardCheck, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackComponentInspected } from '../lib/engagement';

// Detailed data for each architectural component
interface ArchitectureComponent {
  id: string;
  name: string;
  category: string;
  threePos: [number, number, number]; // Position in the 3D scene
  threeSize: [number, number, number]; // Box dimensions for mesh rendering
  materialSpecs: {
    baseMaterial: string;
    thicknessRating: string;
    standards: string[];
    durability: string;
  };
  costBreakdown: {
    materials: number;
    fabrication: number;
    labor: number;
    total: number;
  };
  benefits: string[];
  investorRational: string;
}

const ARCHITECTURE_COMPONENTS: ArchitectureComponent[] = [
  {
    id: 'ballistic-shield',
    name: 'UL-752 Level 3 Ballistic Shield',
    category: 'Transparent Barrier',
    threePos: [6.05, 1.2, 1],
    threeSize: [0.15, 1.4, 2],
    materialSpecs: {
      baseMaterial: 'Layered Polycarbonate & Acrylic Laminate with abrasion-resistant hardcoat',
      thicknessRating: '1.25 in (32 mm) bullet-resistant composite sheet',
      standards: ['UL-752 Level 3 Certification', 'NIJ IIIA Compliant', 'STC 38 Acoustical Rating'],
      durability: 'Non-yellowing formulation, UV-stabilized, high impact structural modulus',
    },
    costBreakdown: {
      materials: 6800,
      fabrication: 1400,
      labor: 1200,
      total: 9400,
    },
    benefits: [
      'Withstands three direct rounds from a .44 Magnum handgun (no penetration or spall).',
      'Provides high optical clarity (88% light transmission) for comfortable guest interactions.',
      'Acoustic design allows natural voice communication without power-assisted intercom systems.',
      'Class A surface finish prevents chemical fogging and key scratches.'
    ],
    investorRational: 'Guarantees absolute separation of staff and assets from the public after hours, preventing 100% of physical intrusion and armed robberies.'
  },
  {
    id: 'structural-framing',
    name: 'ASTM A36 Heavy Steel Framing',
    category: 'Reinforcement & Anchor',
    threePos: [6.05, 1.2, 1], // rendered as custom frame
    threeSize: [0.4, 1.55, 2.1],
    materialSpecs: {
      baseMaterial: 'Cold-formed structural steel channels and architectural angles',
      thicknessRating: '1/4 in (6.3 mm) solid core gauge with zinc-chromate primer',
      standards: ['ASTM A36 Structural Steel', 'AWS D1.1 Welding Certification', 'IBC 2021 Wind & Impact Rated'],
      durability: 'Powder-coated dual-stage black satin finish, rust and corrosion-proof',
    },
    costBreakdown: {
      materials: 3500,
      fabrication: 1900,
      labor: 1600,
      total: 7000,
    },
    benefits: [
      'Anchors the ballistic window directly to the building’s foundation and reinforced masonry blocks.',
      'Counter-levered weight distribution prevents frame collapse from sledgehammer or vehicular ramming.',
      'Sleek flush-mount design hides heavy anchoring bolts inside the interior drywall cavity.',
      'Thermal-break insulation strip prevents moisture condensation and drafts during winter cold snaps.'
    ],
    investorRational: 'A bullet-resistant window is only as strong as its frame. This heavy-duty steel skeleton ensures the portal remains uncompromised under violent physical attack.'
  },
  {
    id: 'stainless-tray',
    name: 'Stainless Steel Transaction Tray',
    category: 'Secure Pass-Through',
    threePos: [5.8, 0.5, 1],
    threeSize: [0.8, 0.2, 1.2],
    materialSpecs: {
      baseMaterial: 'Grade 304 High-Precision Brushed Stainless Steel with solid core filling',
      thicknessRating: '10-gauge (3.4 mm) heavy stainless outer shell',
      standards: ['ADA 2010 Compliance', 'ASTM F3038 Anti-Passback Standard'],
      durability: 'Satin finish resists chemical sanitisers, scratching, and heavy coin abrasion',
    },
    costBreakdown: {
      materials: 2200,
      fabrication: 1100,
      labor: 700,
      total: 4000,
    },
    benefits: [
      'Recessed, anti-passback curved tray allows zero external draft or physical reach-in vector.',
      'Smooth action sliding lock plate operated purely from the interior clerk side.',
      'Accommodates extra-large containers (gallon jugs, grocery packs) via high-clearance hood.',
      'Dual coin scoops for swift, comfortable change exchange during cash-heavy transactions.'
    ],
    investorRational: 'Enables safe commerce flow of essential items, packaged goods, and payment methods without exposing any physical gap to the outside environment.'
  },
  {
    id: 'lighting-surveillance',
    name: 'LED Halo & Cloud CCTV Matrix',
    category: 'Deterrence & Analytics',
    threePos: [5.8, 2.4, 1],
    threeSize: [0.6, 0.15, 0.6],
    materialSpecs: {
      baseMaterial: 'IP67 Weatherproof Cast Aluminum chassis, high-power Cree LED arrays',
      thicknessRating: 'Vandal-resistant polycarbonate dome enclosure (IK10 Rated)',
      standards: ['UL 1598 (Luminaires)', 'NDAA Compliant surveillance hardware'],
      durability: 'Solid-state electronics rated for -40°C to +50°C operations',
    },
    costBreakdown: {
      materials: 4100,
      fabrication: 600,
      labor: 1800,
      total: 6500,
    },
    benefits: [
      'High-intensity 4000K daylight LED floodlighting eliminates dark blindspots at the portal.',
      'Wide-angle 4K optical cameras capture high-resolution faces, license plates, and transactional detail.',
      'Real-time edge AI triggers instant mobile notifications for loitering, crowd-forming, or raised voices.',
      'Back-up power supply (UPS) maintains 4 hours of complete system integrity during grid outages.'
    ],
    investorRational: 'Optimizes customer comfort during night visits while providing clear evidence trails that reduce insurance claims to negligible levels.'
  },
  {
    id: 'interlocking-actuators',
    name: 'Hydraulic Deadbolt Actuators',
    category: 'Automated Lockdown',
    threePos: [6.1, 1.2, 2.1], // Rendered on the sides of the window
    threeSize: [0.15, 0.4, 0.15],
    materialSpecs: {
      baseMaterial: 'Case-hardened steel pins, solid brass cylinders, pneumatic pressure pistons',
      thicknessRating: '1 in (25.4 mm) throw diameter steel locking bolts',
      standards: ['ANSI/BHMA Grade 1 Security Certified', 'NFPA 101 Life Safety Compliant'],
      durability: 'Tested for over 1,500,000 failure-free locking cycles',
    },
    costBreakdown: {
      materials: 2900,
      fabrication: 900,
      labor: 1500,
      total: 5300,
    },
    benefits: [
      'Deploys 450 lbs of positive mechanical holding pressure instantly upon lockdown sequence.',
      'Pneumatic and hydraulic backups ensure the deadbolt remains extended even if electrical cables are cut.',
      'Manual override lever for instantaneous mechanical deployment in non-electrical emergencies.',
      'Silent-trip panic system notifies private security dispatch silently upon deadbolt engagement.'
    ],
    investorRational: 'Automates extreme response in less than 0.4 seconds, taking human error out of emergency escalation situations.'
  }
];

// Interactive 3D Canvas Layout with dynamic highlighting based on selected component
const InteractiveStoreLayout = ({ 
  selectedId, 
  onSelect 
}: { 
  selectedId: string; 
  onSelect: (id: string) => void;
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  useCursor(!!hoveredId);

  return (
    <group position={[0, -0.6, 0]}>
      {/* Floor */}
      <Plane args={[13, 9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#0b0b0d" roughness={0.9} />
      </Plane>
      <gridHelper args={[13, 13, '#1e293b', '#0f172a']} position={[0, 0.01, 0]} />
      
      {/* Outer Shell/Walls */}
      <Box args={[13, 3, 0.2]} position={[0, 1.5, -4.5]} castShadow receiveShadow>
        <meshStandardMaterial color="#131316" roughness={0.7} />
      </Box>
      <Box args={[0.2, 3, 9]} position={[-6.5, 1.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#131316" roughness={0.7} />
      </Box>
      <Box args={[13, 3, 0.2]} position={[0, 1.5, 4.5]} castShadow receiveShadow>
        <meshStandardMaterial color="#131316" roughness={0.7} />
      </Box>

      {/* Interior Shelving Modules */}
      <group position={[-2, 0, -1]}>
        {[0, 1, 2].map((z) => (
          <Box key={z} args={[5.5, 1.8, 0.6]} position={[0, 0.9, z * 2 - 2]} castShadow receiveShadow>
            <meshStandardMaterial color="#1a1a20" roughness={0.5} />
          </Box>
        ))}
      </group>

      {/* Secure Cashier Counter */}
      <Box args={[3.2, 1.1, 1.2]} position={[2.5, 0.55, -2]} castShadow receiveShadow>
        <meshStandardMaterial color="#111115" roughness={0.4} />
      </Box>

      {/* COMPONENT 1: Ballistic Window */}
      <group 
        position={[6.4, 0, 0.8]} 
        onPointerOver={(e) => { e.stopPropagation(); setHoveredId('ballistic-shield'); }}
        onPointerOut={() => setHoveredId(null)}
        onClick={(e) => { e.stopPropagation(); onSelect('ballistic-shield'); }}
      >
        {/* Ballistic Glass Shield Mesh */}
        <Box 
          args={[0.15, 1.4, 2]} 
          position={[0, 1.2, 0]} 
          castShadow
        >
          <MeshTransmissionMaterial 
            backside
            thickness={0.12}
            roughness={0.01}
            transmission={1}
            ior={1.5}
            chromaticAberration={0.05}
            anisotropy={0.1}
            color={selectedId === 'ballistic-shield' ? '#38bdf8' : hoveredId === 'ballistic-shield' ? '#bae6fd' : '#e0f2fe'}
          />
        </Box>
      </group>

      {/* COMPONENT 2: Steel Framing (rendered around window) */}
      <group
        onPointerOver={(e) => { e.stopPropagation(); setHoveredId('structural-framing'); }}
        onPointerOut={() => setHoveredId(null)}
        onClick={(e) => { e.stopPropagation(); onSelect('structural-framing'); }}
      >
        <Box 
          args={[0.3, 1.5, 2.15]} 
          position={[6.4, 1.2, 0.8]}
        >
          <meshStandardMaterial 
            color={selectedId === 'structural-framing' ? '#38bdf8' : hoveredId === 'structural-framing' ? '#7dd3fc' : '#27272a'}
            wireframe={selectedId === 'structural-framing' || hoveredId === 'structural-framing'}
            roughness={0.2}
            metalness={0.9}
          />
        </Box>
      </group>

      {/* COMPONENT 3: Transaction Tray */}
      <group
        position={[6.0, 0.45, 0.8]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredId('stainless-tray'); }}
        onPointerOut={() => setHoveredId(null)}
        onClick={(e) => { e.stopPropagation(); onSelect('stainless-tray'); }}
      >
        <Box args={[0.8, 0.15, 1.1]} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial 
            color={selectedId === 'stainless-tray' ? '#38bdf8' : hoveredId === 'stainless-tray' ? '#7dd3fc' : '#52525b'} 
            roughness={0.1}
            metalness={0.8}
          />
        </Box>
        <Box args={[0.7, 0.01, 1.0]} position={[0, 0.08, 0]}>
          <meshStandardMaterial color="#a1a1aa" metalness={0.95} roughness={0.05} />
        </Box>
      </group>

      {/* COMPONENT 4: Security Lighting and CCTV dome (mounted above window) */}
      <group
        position={[6.2, 2.2, 0.8]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredId('lighting-surveillance'); }}
        onPointerOut={() => setHoveredId(null)}
        onClick={(e) => { e.stopPropagation(); onSelect('lighting-surveillance'); }}
      >
        {/* LED Housing Bar */}
        <Box args={[0.4, 0.1, 1.6]} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial 
            color={selectedId === 'lighting-surveillance' ? '#38bdf8' : hoveredId === 'lighting-surveillance' ? '#7dd3fc' : '#27272a'} 
            metalness={0.6}
          />
        </Box>
        {/* Dome Camera */}
        <Cylinder args={[0.15, 0.15, 0.15, 16]} position={[-0.1, -0.1, 0.4]} castShadow>
          <meshStandardMaterial color="#09090b" roughness={0.1} />
        </Cylinder>
        {/* Glow Element */}
        <Cylinder args={[0.08, 0.08, 0.02, 16]} position={[-0.1, -0.18, 0.4]}>
          <meshBasicMaterial color="#38bdf8" />
        </Cylinder>
      </group>

      {/* COMPONENT 5: Automated Interlocking Deadbolts */}
      <group
        position={[6.4, 1.2, 2.0]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredId('interlocking-actuators'); }}
        onPointerOut={() => setHoveredId(null)}
        onClick={(e) => { e.stopPropagation(); onSelect('interlocking-actuators'); }}
      >
        <Cylinder args={[0.06, 0.06, 0.4, 12]} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial 
            color={selectedId === 'interlocking-actuators' ? '#ef4444' : hoveredId === 'interlocking-actuators' ? '#fca5a5' : '#71717a'} 
            metalness={0.9} 
            roughness={0.2}
          />
        </Cylinder>
        <Box args={[0.12, 0.25, 0.12]} position={[0, 0.15, 0]} castShadow>
          <meshStandardMaterial color="#18181b" />
        </Box>
      </group>

      {/* Main Glass Door (Entrance) */}
      <group position={[6.4, 1.1, -2.5]}>
        {/* Left locked door sliding panel */}
        <Box args={[0.08, 2.2, 1.6]} position={[0, 0, -0.8]} castShadow>
          <meshStandardMaterial color="#3f3f46" transparent opacity={0.3} />
        </Box>
        {/* Right sliding panel */}
        <Box args={[0.08, 2.2, 1.6]} position={[0, 0, 0.8]} castShadow>
          <meshStandardMaterial color="#3f3f46" transparent opacity={0.3} />
        </Box>
        {/* Locked sign */}
        <Box args={[0.1, 0.3, 0.4]} position={[0.1, 1.1, 0]}>
          <meshStandardMaterial color="#ef4444" />
        </Box>
      </group>

      {/* Signage text on side wall */}
      <Text
        position={[6.35, 2.3, 0.8]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.2}
        color="#38bdf8"
        anchorX="center"
        anchorY="middle"
      >
        24HR SAFE-WINDOW
      </Text>
    </group>
  );
};

export const StoreModelViewer = () => {
  const [selectedCompId, setSelectedCompId] = useState<string>('ballistic-shield');
  const selectedComponent = ARCHITECTURE_COMPONENTS.find(c => c.id === selectedCompId)!;

  useEffect(() => {
    if (selectedCompId) {
      trackComponentInspected(selectedCompId);
    }
  }, [selectedCompId]);

  // Compute overall budget numbers
  const totalMaterials = ARCHITECTURE_COMPONENTS.reduce((sum, c) => sum + c.costBreakdown.materials, 0);
  const totalFabrication = ARCHITECTURE_COMPONENTS.reduce((sum, c) => sum + c.costBreakdown.fabrication, 0);
  const totalLabor = ARCHITECTURE_COMPONENTS.reduce((sum, c) => sum + c.costBreakdown.labor, 0);
  const totalCapEx = ARCHITECTURE_COMPONENTS.reduce((sum, c) => sum + c.costBreakdown.total, 0);

  return (
    <div className="w-full bg-zinc-950/50 border border-white/10 p-6 sm:p-10">
      <div className="flex flex-col xl:flex-row gap-10">
        
        {/* LEFT COLUMN: 3D Scene and Legend */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="relative w-full h-[550px] bg-[#050507] border border-white/5 overflow-hidden">
            <Canvas camera={{ position: [8, 5, 8], fov: 38 }} shadows>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 15, 10]} intensity={1.8} castShadow />
              <spotLight position={[6, 4, 1]} intensity={2.5} color="#38bdf8" angle={0.4} penumbra={0.6} castShadow />
              <InteractiveStoreLayout 
                selectedId={selectedCompId} 
                onSelect={setSelectedCompId} 
              />
              <Environment preset="city" />
              <OrbitControls 
                enablePan={true} 
                enableZoom={true} 
                enableRotate={true} 
                maxPolarAngle={Math.PI / 2 - 0.05} 
                minDistance={4}
                maxDistance={15}
              />
              <ContactShadows position={[0, -0.59, 0]} opacity={0.6} scale={18} blur={2.5} far={8} />
            </Canvas>

            {/* Float Badge/Title */}
            <div className="absolute top-6 left-6 pointer-events-none space-y-1">
              <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-sky-400 font-bold">Interactive Engineering Spec</span>
              <h3 className="text-2xl font-light text-white tracking-tighter">Safe-Window <span className="font-serif italic text-sky-400">Architecture</span></h3>
              <p className="text-[10px] text-slate-500 font-mono">DRAG TO ROTATE // CLICK PARTS TO INSPECT MATERIALS & COSTS</p>
            </div>

            {/* Interactive Part Highlighter Indicator Legend */}
            <div className="absolute bottom-6 left-6 right-6 bg-black/85 backdrop-blur-md border border-white/10 p-3 flex flex-wrap gap-2 items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">Quick-Select Segment:</span>
              <div className="flex flex-wrap gap-2">
                {ARCHITECTURE_COMPONENTS.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompId(comp.id)}
                    className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider transition-all border ${
                      selectedCompId === comp.id 
                        ? 'bg-sky-400/10 border-sky-400 text-sky-400' 
                        : 'border-white/5 text-slate-500 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {comp.id.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Overall Construction Capital Expense (CapEx) Summary Card */}
          <div className="border border-white/5 bg-[#070709] p-6">
            <div className="flex items-center gap-2 mb-6">
              <ClipboardCheck className="w-5 h-5 text-sky-400" />
              <h4 className="text-xs uppercase tracking-widest text-slate-200 font-bold">Consolidated Portal CapEx Budget</h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0b0b0d] p-4 border border-white/5">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-1">Materials Cost</span>
                <span className="text-lg font-light text-white">${totalMaterials.toLocaleString()}</span>
                <div className="w-full bg-white/5 h-1 mt-2">
                  <div className="bg-sky-400 h-1" style={{ width: `${(totalMaterials/totalCapEx)*100}%` }} />
                </div>
              </div>

              <div className="bg-[#0b0b0d] p-4 border border-white/5">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-1">Fabrication Fees</span>
                <span className="text-lg font-light text-white">${totalFabrication.toLocaleString()}</span>
                <div className="w-full bg-white/5 h-1 mt-2">
                  <div className="bg-emerald-400 h-1" style={{ width: `${(totalFabrication/totalCapEx)*100}%` }} />
                </div>
              </div>

              <div className="bg-[#0b0b0d] p-4 border border-white/5">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-1">Installation Labor</span>
                <span className="text-lg font-light text-white">${totalLabor.toLocaleString()}</span>
                <div className="w-full bg-white/5 h-1 mt-2">
                  <div className="bg-amber-400 h-1" style={{ width: `${(totalLabor/totalCapEx)*100}%` }} />
                </div>
              </div>

              <div className="bg-[#0b0b0d] p-4 border border-sky-500/20 shadow-[0_0_15px_rgba(56,189,248,0.05)]">
                <span className="text-[9px] uppercase tracking-widest text-sky-400 font-bold block mb-1">Total CapEx Estimate</span>
                <span className="text-lg font-bold text-sky-400">${totalCapEx.toLocaleString()}</span>
                <p className="text-[9px] text-slate-500 font-mono mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" /> Payback Period: 1.8 Mo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Specifications, Costs & Benefits Detail Dashboard */}
        <div className="w-full xl:w-[480px] flex flex-col gap-6">
          
          {/* Active Component Specification Header */}
          <div className="border border-white/10 bg-[#09090c] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono bg-sky-400/10 text-sky-400 px-2 py-0.5 border border-sky-400/20 uppercase font-bold">
                {selectedComponent.category}
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: {selectedComponent.id}</span>
            </div>
            
            <h3 className="text-2xl font-serif italic text-white">{selectedComponent.name}</h3>
            
            <p className="text-xs text-amber-500 bg-amber-500/5 border border-amber-500/15 p-3 flex items-start gap-2.5 leading-normal">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Clerk Protection Value:</strong> {selectedComponent.investorRational}</span>
            </p>
          </div>

          {/* Component Cost Analysis */}
          <div className="border border-white/10 bg-[#09090c] p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <DollarSign className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs uppercase tracking-widest text-white font-bold">Capital Outlay Breakdown</h4>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Procured Materials:</span>
                <span className="text-white">${selectedComponent.costBreakdown.materials.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Custom Fabrication:</span>
                <span className="text-white">${selectedComponent.costBreakdown.fabrication.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">On-Site Installation Labor:</span>
                <span className="text-white">${selectedComponent.costBreakdown.labor.toLocaleString()}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-bold">
                <span className="text-sky-400">Cumulative Component CapEx:</span>
                <span className="text-sky-400">${selectedComponent.costBreakdown.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Material Specifications & Engineering Standards */}
          <div className="border border-white/10 bg-[#09090c] p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Hammer className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs uppercase tracking-widest text-white font-bold">Material Specifications</h4>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[9px] font-mono block">Compound Material Composition</span>
                <p className="text-slate-200 mt-1 leading-relaxed">{selectedComponent.materialSpecs.baseMaterial}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-mono block">Dimension Profile</span>
                  <p className="text-slate-200 mt-1">{selectedComponent.materialSpecs.thicknessRating}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-mono block">Environmental Integrity</span>
                  <p className="text-slate-200 mt-1">{selectedComponent.materialSpecs.durability}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[9px] font-mono block">Regulatory Compliance & Certificates</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {selectedComponent.materialSpecs.standards.map((std, idx) => (
                    <span key={idx} className="bg-white/5 border border-white/10 px-2 py-1 text-[9px] text-slate-300 font-mono">
                      {std}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Core Architectural and Operational Benefits */}
          <div className="border border-white/10 bg-[#09090c] p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs uppercase tracking-widest text-white font-bold">Engineered Safeguards & Benefits</h4>
            </div>

            <ul className="space-y-3">
              {selectedComponent.benefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-300">
                  <span className="text-sky-400 font-mono font-bold shrink-0 mt-0.5">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
