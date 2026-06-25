import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Users, DollarSign, Activity, ShieldCheck, TrendingUp, Info, HelpCircle, Eye, EyeOff, LayoutGrid } from 'lucide-react';

const locations = [
  {
    id: 'primary',
    name: '4412 36 Ave NW',
    desc: 'Primary Target: High residential density, mixed-use zoning, moderate late-night competition.',
    demographics: {
      population: '24,500',
      income: '$68,000',
      traffic: 'High',
    },
    chartData: [
      { subject: 'Safety', SafeMart: 140, Competitors: 60, fullMark: 150 },
      { subject: 'Pricing', SafeMart: 98, Competitors: 130, fullMark: 150 },
      { subject: 'Location', SafeMart: 120, Competitors: 130, fullMark: 150 },
      { subject: 'Tech', SafeMart: 135, Competitors: 80, fullMark: 150 },
      { subject: 'Efficiency', SafeMart: 110, Competitors: 90, fullMark: 150 },
      { subject: 'Convenience', SafeMart: 115, Competitors: 110, fullMark: 150 },
    ]
  },
  {
    id: 'whyte',
    name: 'Whyte Ave & 109 St',
    desc: 'Secondary Option: Extreme late-night foot traffic, high commercial density, steep rent costs.',
    demographics: {
      population: '18,200',
      income: '$72,500',
      traffic: 'Very High',
    },
    chartData: [
      { subject: 'Safety', SafeMart: 145, Competitors: 90, fullMark: 150 },
      { subject: 'Pricing', SafeMart: 90, Competitors: 110, fullMark: 150 },
      { subject: 'Location', SafeMart: 140, Competitors: 145, fullMark: 150 },
      { subject: 'Tech', SafeMart: 135, Competitors: 100, fullMark: 150 },
      { subject: 'Efficiency', SafeMart: 120, Competitors: 85, fullMark: 150 },
      { subject: 'Convenience', SafeMart: 130, Competitors: 125, fullMark: 150 },
    ]
  },
  {
    id: '118ave',
    name: '118 Ave NW (Alberta Ave)',
    desc: 'Tertiary Option: Revitalization zone, low rent, high necessity for safe late-night operations.',
    demographics: {
      population: '15,800',
      income: '$54,000',
      traffic: 'Medium',
    },
    chartData: [
      { subject: 'Safety', SafeMart: 150, Competitors: 40, fullMark: 150 },
      { subject: 'Pricing', SafeMart: 110, Competitors: 120, fullMark: 150 },
      { subject: 'Location', SafeMart: 95, Competitors: 100, fullMark: 150 },
      { subject: 'Tech', SafeMart: 125, Competitors: 60, fullMark: 150 },
      { subject: 'Efficiency', SafeMart: 100, Competitors: 80, fullMark: 150 },
      { subject: 'Convenience', SafeMart: 105, Competitors: 90, fullMark: 150 },
    ]
  }
];

const categoryInsights: Record<string, { title: string; desc: string; safemartAdv: string; competitorVuln: string; iconColor: string }> = {
  Safety: {
    title: 'Physical & Asset Security',
    desc: 'Elimination of interior customer entry during night shifts completely removes physical violence and grab-and-run theft.',
    safemartAdv: 'Lockdown Safe-Window transitions automatically at 10 PM. 1.25" ballistic acrylic shield prevents all indoor security risks.',
    competitorVuln: 'Open doors 24/7 invite loitering, grab-and-run shoplifting, and put solo cashiers in high-vulnerability situations.',
    iconColor: 'text-rose-400 bg-rose-500/5 border-rose-500/10'
  },
  Pricing: {
    title: 'Competitive Retail Pricing',
    desc: 'Inventory shrinkage is typically passed to customers via inflated retail prices. SafeMart bypasses this overhead.',
    safemartAdv: 'Near-zero shrinkage allows SafeMart to maintain lower daily pricing averages, capturing high-margin loyalty.',
    competitorVuln: 'Average 2-3% shrinkage rate forces competitors to increase pricing to cover commercial insurance premiums and stolen inventory.',
    iconColor: 'text-amber-400 bg-amber-500/5 border-amber-500/10'
  },
  Location: {
    title: 'Real Estate & Site Quality',
    desc: 'High traffic locations are often plagued by crime, making them double-edged swords for open-door overnight setups.',
    safemartAdv: 'Capitalizes on top-tier high-traffic corner lots without yielding to the security risks that plague premium real estate.',
    competitorVuln: 'Often forced to close early (11 PM) or lease low-traffic low-density sub-properties to mitigate persistent crime threat.',
    iconColor: 'text-sky-400 bg-sky-500/5 border-sky-500/10'
  },
  Tech: {
    title: 'IoT & Security Automation',
    desc: 'Modern edge-computing AI allows cameras to detect loitering patterns and lock down hardware automatically.',
    safemartAdv: 'Integrated AI cloud CCTV matrix, motorized deadbolt actuators, and silent alarm relays operated from safety zones.',
    competitorVuln: 'Standard analog CCTV recorders stored in back offices, with simple manual panic button switches at the register.',
    iconColor: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10'
  },
  Efficiency: {
    title: 'Transaction Throughput Rate',
    desc: 'Streamlining walk-up orders expedites purchase times during peak night hours.',
    safemartAdv: 'Pre-ordered or window-requested transactions complete in average 45 seconds, maximizing quick convenience drive-bys.',
    competitorVuln: 'Lengthy checkouts, customers wandering aisles, and manual cash handoffs slow down service velocity.',
    iconColor: 'text-fuchsia-400 bg-fuchsia-500/5 border-fuchsia-500/10'
  },
  Convenience: {
    title: 'Availability & Night Convenience',
    desc: 'Continuous access means captured volume from shift workers, delivery drivers, and emergency responders.',
    safemartAdv: 'Uninterrupted 24/7 commerce. Walk-up service window keeps full inventory accessible through secure transactions.',
    competitorVuln: 'Many competitors close doors completely, or lock doors and force customers to stand outdoors with zero service availability.',
    iconColor: 'text-violet-400 bg-violet-500/5 border-violet-500/10'
  }
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050507] border border-white/10 p-4 shadow-[0_0_25px_rgba(0,0,0,0.8)] font-mono text-xs space-y-2">
        <p className="font-bold text-white uppercase tracking-widest border-b border-white/15 pb-1.5 mb-2">
          {payload[0].payload.subject} Performance
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex justify-between items-center gap-6">
            <span style={{ color: entry.color }} className="font-medium">
              {entry.name}:
            </span>
            <span className="text-white font-bold">{entry.value}/150</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const MarketOpportunity = () => {
  const [selectedLocId, setSelectedLocId] = useState('primary');
  const [activeCategory, setActiveCategory] = useState<string>('Safety');
  const [chartFocus, setChartFocus] = useState<'both' | 'safemart' | 'competitors'>('both');

  const selectedLocation = locations.find(loc => loc.id === selectedLocId)!;
  const activeInsight = categoryInsights[activeCategory] || categoryInsights['Safety'];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24"
      id="market-opportunity-section"
    >
      <div className="border border-white/10 bg-zinc-900/30 p-8 sm:p-12">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.3em] uppercase text-sky-400 font-bold">Demographic Targeting</span>
            <h2 className="text-4xl font-light text-white tracking-tighter">Market <span className="font-serif italic text-sky-400">Opportunity</span></h2>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setSelectedLocId(loc.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest font-bold transition-all border ${
                  selectedLocId === loc.id 
                    ? 'bg-sky-400/10 border-sky-400 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)]' 
                    : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'
                }`}
              >
                <MapPin className="w-4 h-4" />
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Column 1: Demographics & Category Selector */}
          <div className="xl:col-span-4 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-serif italic text-white">{selectedLocation.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedLocation.desc}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3 pt-2">
                <div className="border border-white/5 bg-[#08080a] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Population (5km)</span>
                  </div>
                  <span className="text-sm font-mono text-white">{selectedLocation.demographics.population}</span>
                </div>

                <div className="border border-white/5 bg-[#08080a] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Avg Income</span>
                  </div>
                  <span className="text-sm font-mono text-white">{selectedLocation.demographics.income}</span>
                </div>

                <div className="border border-white/5 bg-[#08080a] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-fuchsia-400" />
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Late Traffic</span>
                  </div>
                  <span className="text-sm font-mono text-white">{selectedLocation.demographics.traffic}</span>
                </div>
              </div>
            </div>

            {/* Interactive Selector Buttons to highlight radar categories */}
            <div className="space-y-2.5 pt-4 border-t border-white/5">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block mb-1">Click parameters to inspect details:</span>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(categoryInsights).map((catName) => (
                  <button
                    key={catName}
                    onClick={() => setActiveCategory(catName)}
                    className={`p-3 text-left border transition-all ${
                      activeCategory === catName 
                        ? 'border-sky-400 bg-sky-400/5 text-white shadow-[0_0_15px_rgba(56,189,248,0.1)]' 
                        : 'border-white/5 bg-zinc-950/40 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-mono block font-bold">{catName}</span>
                    <span className="text-[9px] text-slate-500 mt-0.5 block">
                      SafeMart: {selectedLocation.chartData.find(d => d.subject === catName)?.SafeMart}/150
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Enhanced Interactive Radar Chart Area */}
          <div className="xl:col-span-8 flex flex-col justify-between gap-6">
            
            <div className="relative border border-white/10 bg-[#050507] p-6 flex flex-col justify-between min-h-[460px]">
              
              {/* Radar Top Toolbar / Filters */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 z-10 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-sky-400" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">Acoustic Radar Assessment</span>
                </div>
                
                {/* Layer toggles */}
                <div className="flex items-center gap-1.5 bg-black p-1 border border-white/5">
                  <button
                    onClick={() => setChartFocus('both')}
                    className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider transition-all ${
                      chartFocus === 'both' ? 'bg-zinc-800 text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Compare Both
                  </button>
                  <button
                    onClick={() => setChartFocus('safemart')}
                    className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider transition-all ${
                      chartFocus === 'safemart' ? 'bg-sky-400 text-black font-bold' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    SafeMart
                  </button>
                  <button
                    onClick={() => setChartFocus('competitors')}
                    className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider transition-all ${
                      chartFocus === 'competitors' ? 'bg-amber-500 text-black font-bold' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Competitors
                  </button>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="h-[340px] w-full relative z-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="82%" data={selectedLocation.chartData}>
                    <PolarGrid stroke="#33333f" strokeDasharray="3 3" />
                    
                    {/* Tick formatting and custom click handler to switch categories */}
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'medium' }} 
                    />
                    
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 150]} 
                      tick={false} 
                      axisLine={false} 
                    />
                    
                    {/* SafeMart Radar Area */}
                    {(chartFocus === 'both' || chartFocus === 'safemart') && (
                      <Radar
                        name="SafeMart Strategy"
                        dataKey="SafeMart"
                        stroke="#38bdf8"
                        strokeWidth={2.5}
                        fill="#38bdf8"
                        fillOpacity={activeCategory === 'Safety' ? 0.55 : 0.35}
                        animationBegin={100}
                        animationDuration={800}
                      />
                    )}

                    {/* Competitors Radar Area */}
                    {(chartFocus === 'both' || chartFocus === 'competitors') && (
                      <Radar
                        name="Standard Local Competitors"
                        dataKey="Competitors"
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        fill="#f59e0b"
                        fillOpacity={activeCategory === 'Safety' ? 0.55 : 0.35}
                        animationBegin={100}
                        animationDuration={800}
                      />
                    )}

                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>

                {/* Ambient Category Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] font-serif text-[100px] select-none uppercase tracking-widest text-white">
                  {activeCategory}
                </div>
              </div>

              {/* Dynamic Legend indicators */}
              <div className="flex justify-center items-center gap-8 border-t border-white/5 pt-4 text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1.5 bg-sky-400" />
                  <span className="text-slate-300">SafeMart Protection Scope</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1.5 bg-amber-500" />
                  <span className="text-slate-300">Competitor Exposed Baseline</span>
                </div>
              </div>

            </div>

            {/* Category Insight Deep-Dive Dashboard Row */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="border border-white/10 bg-[#09090c] p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      activeCategory === 'Safety' ? 'bg-rose-400' :
                      activeCategory === 'Pricing' ? 'bg-amber-400' :
                      activeCategory === 'Location' ? 'bg-sky-400' :
                      activeCategory === 'Tech' ? 'bg-emerald-400' :
                      activeCategory === 'Efficiency' ? 'bg-fuchsia-400' : 'bg-violet-400'
                    }`} />
                    <h4 className="text-sm font-serif italic text-white">{activeInsight.title}</h4>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Active Metric Profile</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeInsight.desc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#050507] border-l-2 border-sky-400 p-4">
                    <span className="text-[9px] uppercase tracking-widest text-sky-400 font-mono font-bold block mb-1">SafeMart Solution Advantage</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {activeInsight.safemartAdv}
                    </p>
                  </div>
                  <div className="bg-[#050507] border-l-2 border-amber-500 p-4">
                    <span className="text-[9px] uppercase tracking-widest text-amber-500 font-mono font-bold block mb-1">Competitor Vulnerability Gap</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {activeInsight.competitorVuln}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>
    </motion.section>
  );
};
