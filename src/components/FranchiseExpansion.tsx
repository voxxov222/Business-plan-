import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Coins, 
  Award, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  ArrowUpRight, 
  FileText, 
  Clock, 
  CheckCircle, 
  Compass, 
  Sparkles,
  Percent,
  Map,
  BadgeAlert
} from 'lucide-react';

interface ExpansionPhase {
  id: number;
  title: string;
  timeline: string;
  geographicScope: string;
  milestones: string[];
  status: 'active' | 'scheduled' | 'concept';
  projectedStores: number;
}

interface TrainingTrack {
  title: string;
  duration: string;
  focus: string;
  modules: string[];
  icon: React.ReactNode;
}

interface Territory {
  id: string;
  name: string;
  density: string;
  safetyScore: number;
  available: boolean;
  royaltyDiscount: string;
  optimalFormat: string;
}

export const FranchiseExpansion = () => {
  // State for interactive startup planning calculator
  const [format, setFormat] = useState<'express' | 'standard' | 'flagship'>('standard');
  const [territory, setTerritory] = useState<'edmonton' | 'alberta_mid' | 'prairies'>('edmonton');
  const [includePremiumSupport, setIncludePremiumSupport] = useState<boolean>(true);
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string>('edm_mill');

  // Phases of franchise expansion outlook
  const phases: ExpansionPhase[] = [
    {
      id: 1,
      title: 'Alberta Anchor Pilot Program',
      timeline: 'Q3 2026 - Q2 2027',
      geographicScope: 'Greater Edmonton & Red Deer Corridor',
      milestones: [
        'Secure 3 corporate-owned anchor locations using UL-752 Level 3 safety glass.',
        'Establish Edmonton central distribution hub with express wholesale partners.',
        'Acquire BDC / ATB Franchise-certified status for automated funding approval.'
      ],
      status: 'active',
      projectedStores: 4
    },
    {
      id: 2,
      title: 'Provincial Blitz Expansion',
      timeline: 'Q3 2027 - Q4 2028',
      geographicScope: 'Calgary, Lethbridge, Medicine Hat, Grand Prairie',
      milestones: [
        'Launch Franchise Co-Op marketing fund supported by 1% gross royalty buy-back.',
        'Deploy smart telemetry integrations with major local courier networks for overnight parcel drops.',
        'Target 15 franchisee-operated storefronts along high-commuter medical corridors.'
      ],
      status: 'scheduled',
      projectedStores: 15
    },
    {
      id: 3,
      title: 'Western Prairie Consolidation',
      timeline: 'Q1 2029 - Q4 2030',
      geographicScope: 'Saskatchewan (Saskatoon, Regina) & Manitoba (Winnipeg)',
      milestones: [
        'Integrate Western Canadian grain and transportation hub late-night rest corridors.',
        'Introduce automated central supply replenishments using AI-vending telemetry.',
        'First cross-provincial franchise regional master coordinator designated.'
      ],
      status: 'concept',
      projectedStores: 35
    }
  ];

  // Startup training programs
  const trainingTracks: TrainingTrack[] = [
    {
      title: 'Hermetic Safety Window Operations',
      duration: 'Week 1-2 (Edmonton Academy)',
      focus: 'Lockdown protocols, FLIR thermal imaging calibration, de-escalation acoustics',
      modules: [
        'Advanced threat detection with micro-capillary tracking integration.',
        'Emergency 400ms pneumatic drop-lock system manual bypass overrides.',
        'Commercial liability insurance coordination & risk compliance certification.'
      ],
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    },
    {
      title: 'Secure Inventory & AI Telemetry',
      duration: 'Week 3 (Virtual & In-Store)',
      focus: 'Demand forecasting, parcel locker handoffs, overnight margin auditing',
      modules: [
        'Dynamic pricing configuration for late-night coffee/medical supply runs.',
        'Automated local merchant deliveries with smart geofence lockers.',
        'Waste prevention metrics for high-margin hot foods and fresh essentials.'
      ],
      icon: <BookOpen className="w-5 h-5 text-sky-400" />
    },
    {
      title: 'Local Store Marketing & ATB Banking Alignment',
      duration: 'Week 4 (Financial Studio)',
      focus: 'Local commercial lending management, local ad spends, P&L dashboarding',
      modules: [
        'Leveraging ATB/BDC low-interest franchise acquisition pathways.',
        'Geo-targeted smartphone push advertising for night-shift healthcare workers.',
        'Integrating direct banking sweeps with centralized POS cash registers.'
      ],
      icon: <Coins className="w-5 h-5 text-amber-400" />
    }
  ];

  // Territory expansion outlook targets
  const territories: Territory[] = [
    { id: 'edm_mill', name: 'Mill Woods South, Edmonton', density: 'High Commuter / Healthcare', safetyScore: 98, available: false, royaltyDiscount: '0.5%', optimalFormat: 'Standard Convenience' },
    { id: 'edm_univ', name: 'University District, Edmonton', density: 'Very High Student Footprint', safetyScore: 95, available: true, royaltyDiscount: '0.0%', optimalFormat: 'Express Safe-Pod' },
    { id: 'cal_trail', name: 'Calgary Trail Corridor, Edmonton', density: 'Ultra-High Commuter Auto', safetyScore: 97, available: true, royaltyDiscount: '1.0% Early-Bird', optimalFormat: 'Flagship Corner' },
    { id: 'cgy_north', name: 'Northeast Medical District, Calgary', density: 'Health Sector Late-Night', safetyScore: 96, available: true, royaltyDiscount: '0.5%', optimalFormat: 'Standard Convenience' },
    { id: 'rd_central', name: 'Gaetz Ave Corridor, Red Deer', density: 'High Transit Stop', safetyScore: 92, available: true, royaltyDiscount: '1.5% Territory Bonus', optimalFormat: 'Standard Convenience' },
  ];

  // Dynamic calculations based on startup selection
  const startupCalculations = useMemo(() => {
    let initialFranchiseFee = 0;
    let buildOutEquipment = 0;
    let baselineWorkingCapital = 0;
    let marketingPushCost = 4500;
    let royaltiesPercent = 5.0;

    // Set Format parameters
    if (format === 'express') {
      initialFranchiseFee = 15000;
      buildOutEquipment = 35000;
      baselineWorkingCapital = 10000;
    } else if (format === 'standard') {
      initialFranchiseFee = 25000;
      buildOutEquipment = 60000;
      baselineWorkingCapital = 15000;
    } else {
      initialFranchiseFee = 40000;
      buildOutEquipment = 95000;
      baselineWorkingCapital = 25000;
    }

    // Territory adjustments
    if (territory === 'alberta_mid') {
      initialFranchiseFee = initialFranchiseFee * 0.90; // 10% discount to incentivize mid-market Alberta
      royaltiesPercent = 4.5;
    } else if (territory === 'prairies') {
      initialFranchiseFee = initialFranchiseFee * 0.85; // 15% prairie pioneer discount
      royaltiesPercent = 4.0;
    }

    // Add optional master premium package
    if (includePremiumSupport) {
      buildOutEquipment += 7500; // Extra for automated premium FLIR sensor kit + biometric HUD
    }

    const totalStartupCapEx = initialFranchiseFee + buildOutEquipment + baselineWorkingCapital + marketingPushCost;
    
    // Revenue projections for franchise
    const projectY1Revenue = format === 'express' ? 180000 : format === 'standard' ? 320000 : 540000;
    const projectY1NetProfit = format === 'express' ? 36000 : format === 'standard' ? 74000 : 135000;
    const monthsToBreakEven = format === 'express' ? 14 : format === 'standard' ? 12 : 11;

    return {
      fee: initialFranchiseFee,
      equipment: buildOutEquipment,
      workingCapital: baselineWorkingCapital,
      marketing: marketingPushCost,
      total: totalStartupCapEx,
      royalties: royaltiesPercent,
      projectY1Revenue,
      projectY1NetProfit,
      breakEven: monthsToBreakEven
    };
  }, [format, territory, includePremiumSupport]);

  const activeTerritory = territories.find(t => t.id === selectedTerritoryId) || territories[0];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24 border border-white/10 bg-zinc-950/20 p-8 sm:p-12 relative overflow-hidden"
      id="franchise-expansion-section"
    >
      {/* Background visual accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/[0.01] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/[0.01] rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] tracking-[0.3em] uppercase text-emerald-400 font-bold block">SafeMart Network Scaling Plan</span>
          <h2 className="text-3xl font-light text-white tracking-tighter">
            Franchise Expansion Programs & <span className="font-serif italic text-emerald-400">Territory Outlook</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2 px-3.5 py-1 bg-zinc-950 border border-white/5 text-[10px] font-mono text-slate-400">
          <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
          <span>BDC/ATB Aligned Start-Up Packages</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* Left Side: Phased Expansion Outlook Timeline (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              Interactive Expansion Timeline & Regional Outlook
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              SafeMart's phased growth path minimizes execution risk. We scale geographically after solidifying our proprietary automated threat-detection intellectual property and retail distribution margins.
            </p>
          </div>

          <div className="space-y-4">
            {phases.map((ph) => (
              <div 
                key={ph.id} 
                className={`p-6 border transition-all relative ${
                  ph.status === 'active'
                    ? 'border-emerald-400 bg-emerald-500/[0.03] shadow-[0_0_20px_rgba(16,185,129,0.06)]'
                    : ph.status === 'scheduled'
                    ? 'border-white/10 bg-zinc-950/40 hover:border-white/20'
                    : 'border-white/5 bg-zinc-950/10 opacity-60'
                }`}
              >
                {/* Timeline badge / Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 border border-emerald-400/20">
                      PHASE 0{ph.id}
                    </span>
                    <h4 className="text-base font-bold text-white tracking-tight">{ph.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                    {ph.timeline}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    Target Territories: <span className="text-white font-bold">{ph.geographicScope}</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300 list-none pl-0">
                    {ph.milestones.map((milestone, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{milestone}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Projected Phase Revenue Bar */}
                  <div className="border-t border-white/5 pt-3 mt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>PROJECTED YEARLY GROSS CHANNELS IN PHASE:</span>
                    <span className="text-white font-bold">
                      {ph.projectedStores} Locations (Est. ${(ph.projectedStores * 320000 / 1000).toLocaleString()}k Gross/yr)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Franchise Startup Program Estimator (Span 5) */}
        <div className="lg:col-span-5 bg-black/40 border border-white/5 p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              Startup Cost & CapEx Estimator
            </h3>
            <p className="text-[11px] text-slate-400">
              Select variables to calculate initial capital outlay, required equipment integration, and projected Year 1 break-even metrics.
            </p>
          </div>

          {/* Selector 1: Store Format */}
          <div className="space-y-2 border-t border-white/5 pt-4">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex justify-between">
              <span>Select Store Format</span>
              <span className="text-emerald-400 font-bold">
                {format === 'express' ? 'Express Safe-Pod' : format === 'standard' ? 'Standard Convenience' : 'Flagship Prime Corner'}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('express')}
                className={`py-2 text-center transition-all border rounded-none flex flex-col justify-center items-center ${
                  format === 'express'
                    ? 'border-emerald-400 bg-emerald-400/5 text-emerald-400 font-bold'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-500'
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold">Express</span>
                <span className="text-[8px] opacity-60">Safe-Window Only</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('standard')}
                className={`py-2 text-center transition-all border rounded-none flex flex-col justify-center items-center ${
                  format === 'standard'
                    ? 'border-emerald-400 bg-emerald-400/5 text-emerald-400 font-bold'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-500'
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold">Standard</span>
                <span className="text-[8px] opacity-60">Full Convenience</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('flagship')}
                className={`py-2 text-center transition-all border rounded-none flex flex-col justify-center items-center ${
                  format === 'flagship'
                    ? 'border-emerald-400 bg-emerald-400/5 text-emerald-400 font-bold'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-500'
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold">Flagship</span>
                <span className="text-[8px] opacity-60">Fuel & Hub Combined</span>
              </button>
            </div>
          </div>

          {/* Selector 2: Regional Area Tier */}
          <div className="space-y-2 border-t border-white/5 pt-4">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex justify-between">
              <span>Territory Priority Zone</span>
              <span className="text-sky-400 font-bold">
                {territory === 'edmonton' ? 'Edmonton Anchor Metro' : territory === 'alberta_mid' ? 'Alberta Mid-Sized Cities' : 'Prairie Regional Expansion'}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTerritory('edmonton')}
                className={`py-1.5 text-center transition-all border rounded-none flex flex-col justify-center items-center ${
                  territory === 'edmonton'
                    ? 'border-sky-400 bg-sky-400/5 text-sky-400 font-bold'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-500'
                }`}
              >
                <span className="text-[9px] font-mono uppercase">Metro EDM</span>
                <span className="text-[7px] opacity-50">Standard Fee</span>
              </button>

              <button
                type="button"
                onClick={() => setTerritory('alberta_mid')}
                className={`py-1.5 text-center transition-all border rounded-none flex flex-col justify-center items-center ${
                  territory === 'alberta_mid'
                    ? 'border-sky-400 bg-sky-400/5 text-sky-400 font-bold'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-500'
                }`}
              >
                <span className="text-[9px] font-mono uppercase">Provincial</span>
                <span className="text-[7px] opacity-50">10% Off Fee</span>
              </button>

              <button
                type="button"
                onClick={() => setTerritory('prairies')}
                className={`py-1.5 text-center transition-all border rounded-none flex flex-col justify-center items-center ${
                  territory === 'prairies'
                    ? 'border-sky-400 bg-sky-400/5 text-sky-400 font-bold'
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10 text-slate-500'
                }`}
              >
                <span className="text-[9px] font-mono uppercase">Prairie Corridor</span>
                <span className="text-[7px] opacity-50">15% Off Fee</span>
              </button>
            </div>
          </div>

          {/* Premium Tech Upgrades Checkbox */}
          <div className="border-t border-white/5 pt-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-white font-bold block">Integrate Custom Safety Package</span>
              <p className="text-[9px] text-slate-400">FLIR thermal analysis cameras & 3D micro-capillary facial iris scanner.</p>
            </div>
            <button
              type="button"
              onClick={() => setIncludePremiumSupport(!includePremiumSupport)}
              className={`px-3 py-1.5 text-[9px] font-mono uppercase border rounded-none transition-all cursor-pointer ${
                includePremiumSupport 
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold' 
                  : 'border-white/10 text-slate-500'
              }`}
            >
              {includePremiumSupport ? 'INCLUDED' : 'EXCLUDED'}
            </button>
          </div>

          {/* Results Summary Box */}
          <div className="bg-[#050508] border border-white/5 p-4 space-y-3 font-mono text-xs">
            <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold block">CAPEX BREAKDOWN:</span>
            
            <div className="space-y-1.5 border-b border-white/5 pb-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Initial Franchise Fee:</span>
                <span className="text-white font-bold">${Math.round(startupCalculations.fee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Security & Store Equipment:</span>
                <span className="text-white font-bold">${Math.round(startupCalculations.equipment).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Marketing & Local PR launch:</span>
                <span className="text-white font-bold">${Math.round(startupCalculations.marketing).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reserved Working Capital:</span>
                <span className="text-white font-bold">${Math.round(startupCalculations.workingCapital).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-sm border-b border-white/5 pb-2.5">
              <span className="text-slate-400 font-bold uppercase">Estimated Initial CapEx:</span>
              <span className="text-emerald-400 font-bold">${Math.round(startupCalculations.total).toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px]">
              <div className="bg-white/[0.02] p-2 border border-white/5">
                <span className="text-[8px] text-slate-500 block">ROYALTY</span>
                <span className="text-white font-bold text-xs">{startupCalculations.royalties.toFixed(1)}%</span>
              </div>
              <div className="bg-white/[0.02] p-2 border border-white/5">
                <span className="text-[8px] text-slate-500 block">Y1 PROFIT</span>
                <span className="text-emerald-400 font-bold text-xs">${(startupCalculations.projectY1NetProfit / 1000).toFixed(0)}k</span>
              </div>
              <div className="bg-white/[0.02] p-2 border border-white/5">
                <span className="text-[8px] text-slate-500 block">BREAK-EVEN</span>
                <span className="text-white font-bold text-xs">{startupCalculations.breakEven} months</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Territory Allocator & Communal Mapping Section (Span 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 border-t border-white/5 pt-10">
        
        {/* Territory Grid Listing Map Concept */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase text-sky-400 font-bold block">GEOGRAPHIC HEAT DETERMINATION</span>
            <h4 className="text-lg font-light text-white tracking-tight">Alberta Priority Allocation Segments</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              We have pre-qualified these zones based on municipal zoning approvals, nocturnal shift employee concentrations, and low competitor density.
            </p>
          </div>

          {/* Territory Buttons Grid */}
          <div className="space-y-2 font-mono text-[11px]">
            {territories.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTerritoryId(t.id)}
                className={`w-full text-left p-3 border transition-all flex justify-between items-center ${
                  selectedTerritoryId === t.id
                    ? 'border-sky-400 bg-sky-400/5 text-white'
                    : 'border-white/5 bg-zinc-950/20 text-slate-400 hover:border-white/10'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${t.available ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                    <span className="font-bold">{t.name}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 block">{t.density}</span>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 font-bold ${
                    t.available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                  }`}>
                    {t.available ? 'AVAILABLE' : 'RESERVED'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Territory Micro Diagnostics Sheet */}
        <div className="lg:col-span-7 bg-zinc-900/15 border border-white/5 p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-start border-b border-white/5 pb-4">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-slate-500 uppercase">SELECTED REGIONAL OPPORTUNITY</span>
              <h4 className="text-xl font-light text-white tracking-tight">{activeTerritory.name}</h4>
            </div>
            
            <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest bg-sky-500/10 px-2 py-0.5 border border-sky-500/20 font-bold">
              EST. SECURITY RATING: {activeTerritory.safetyScore}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="space-y-4">
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase block">Optimal Format:</span>
                <span className="text-white font-bold">{activeTerritory.optimalFormat}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase block">Regional Density:</span>
                <span className="text-white font-bold">{activeTerritory.density}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase block">Franchise Incentives:</span>
                <span className="text-emerald-400 font-bold">{activeTerritory.royaltyDiscount} Royalty Discount</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase block">ATB Regional Fast-Track eligibility:</span>
                <span className="text-white font-bold">Approved (10-Year Amortization)</span>
              </div>
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 p-4 flex gap-4 items-start text-xs">
            <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-slate-300">
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 font-bold block">REGIONAL MARKET INSIGHT:</span>
              <p className="leading-relaxed font-light">
                This territory features a commuter traffic profile that peaks between 11:00 PM and 3:00 AM due to shifting healthcare/industrial personnel. Introducing a 24/7 {activeTerritory.optimalFormat} layout here captures a substantial nocturnal customer share that other local retailers completely neglect.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Franchise Start-Up Program Curriculum (Span 12) */}
      <div className="border-t border-white/5 pt-10">
        <div className="space-y-1.5 mb-8 text-center max-w-2xl mx-auto">
          <span className="text-[10px] tracking-[0.3em] uppercase text-emerald-400 font-bold block">SafeMart Franchise Academy Training</span>
          <h3 className="text-2xl font-light text-white tracking-tighter">Franchisee Start-Up Training Programs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our systematic 4-week training curriculum guarantees every franchise owner and their staff maintain perfect operational discipline and UL-752 safety standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainingTracks.map((tr, idx) => (
            <div key={idx} className="bg-zinc-900/10 border border-white/5 p-6 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-zinc-950 border border-white/10 shrink-0">
                    {tr.icon}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                    {tr.duration}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase text-emerald-400 block font-bold">CURRICULUM TRACK 0{idx + 1}</span>
                  <h4 className="text-sm font-bold text-white tracking-tight">{tr.title}</h4>
                  <p className="text-[10px] font-serif italic text-slate-400 leading-tight">Focus: {tr.focus}</p>
                </div>

                <ul className="space-y-2 text-[11px] text-slate-300 list-none pl-0 border-t border-white/5 pt-4">
                  {tr.modules.map((m, mIdx) => (
                    <li key={mIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-400 font-bold text-[9px] mt-0.5">✓</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/5 pt-4 mt-6 text-[10px] font-mono text-slate-500 flex justify-between items-center">
                <span>Certification Status:</span>
                <span className="text-white font-bold">Mandatory for Launch</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.section>
  );
};
