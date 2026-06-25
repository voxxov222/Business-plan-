import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ShieldAlert, ShieldCheck, Clock, AlertTriangle, Eye, ArrowUpDown, Flame, HelpCircle } from 'lucide-react';

interface Competitor {
  name: string;
  distance: string;
  hours: string;
  nightMode: string;
  safetyFeatures: string[];
  incidents: {
    level: 'High' | 'Medium-High' | 'Medium' | 'Low' | 'Near Zero';
    count: string;
    description: string;
  };
  staffRisk: 'High' | 'Medium' | 'Low' | 'Extremely Low';
  revenueLost: string;
  badgeColor: string;
}

const competitorsData: Competitor[] = [
  {
    name: '7-Eleven (34 Ave NW)',
    distance: '1.2 km away',
    hours: '24/7 (Open Doors)',
    nightMode: 'Unrestricted storefront access',
    safetyFeatures: ['Standard analog CCTV', 'Single panic button at till', 'No physical barriers'],
    incidents: {
      level: 'High',
      count: '16+ per year',
      description: 'Frequent midnight grab-and-run thefts, occasional armed robberies, and high staff turnover.'
    },
    staffRisk: 'High',
    revenueLost: '$0 (but incurs high shrinkage/theft cost)',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/5',
  },
  {
    name: 'Circle K (38 Ave NW)',
    distance: '0.8 km away',
    hours: '24/7 (Open Doors)',
    nightMode: 'Unrestricted storefront access',
    safetyFeatures: ['Basic interior security cameras', 'Counter height alert mirror', 'Single clerk overnight'],
    incidents: {
      level: 'Medium-High',
      count: '11 per year',
      description: 'Shoplifting, verbal abuse of staff, evening property damage, and loitering.'
    },
    staffRisk: 'High',
    revenueLost: '$0 (suffers heavy inventory shrinkage)',
    badgeColor: 'border-orange-500/30 text-orange-400 bg-orange-500/5',
  },
  {
    name: 'Esso Convenience (34 St)',
    distance: '2.1 km away',
    hours: '6:00 AM - 11:00 PM',
    nightMode: 'Closed overnight (Doors locked)',
    safetyFeatures: ['CCTV coverage', 'Bullet-resistant counter glass', 'Auto-locking safe'],
    incidents: {
      level: 'Medium',
      count: '4 per year',
      description: 'Break-ins attempted during closed hours, pump drive-offs during daytime operations.',
    },
    staffRisk: 'Medium',
    revenueLost: 'Est. $110k/yr lost late-night sales',
    badgeColor: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5',
  },
  {
    name: 'SafeMart (4405 36 Ave NW - Proposed)',
    distance: 'Target Location',
    hours: '24/7 (Continuous)',
    nightMode: 'Locked Doors + Safe-Window (10 PM - 6 AM)',
    safetyFeatures: [
      'Late-Night Safe-Window interface',
      'Impact-resistant transaction glass',
      'Dual-locked drop safe & secure till',
      '1080p cloud-sync CCTV matrix',
      'Exterior LED floodlighting layout'
    ],
    incidents: {
      level: 'Near Zero',
      count: '<1 expected',
      description: 'Complete prevention of indoor access during high-risk hours eliminates physical confrontation and grab-and-run theft.',
    },
    staffRisk: 'Extremely Low',
    revenueLost: '$0 (captures full late-night demand safely)',
    badgeColor: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
  }
];

export const CompetitorComparison = () => {
  const [highlightSafeMart, setHighlightSafeMart] = useState(true);
  const [selectedComp, setSelectedComp] = useState<Competitor | null>(competitorsData[3]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24"
    >
      <div className="border border-white/10 bg-zinc-900/30 p-8 sm:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.3em] uppercase text-sky-400 font-bold">Competitive Positioning</p>
            <h2 className="text-4xl font-light text-white tracking-tighter">
              Competitor <span className="font-serif italic text-sky-400">Comparison Table</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setHighlightSafeMart(!highlightSafeMart)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold border transition-all ${
                highlightSafeMart 
                  ? 'bg-sky-400/10 border-sky-400 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)]' 
                  : 'border-white/10 text-white/50 hover:text-white'
              }`}
            >
              Highlight SafeMart Advantage
            </button>
          </div>
        </div>

        <p className="text-sm leading-relaxed opacity-70 mb-8 max-w-4xl">
          Edmonton's late-night convenience retail market suffers from either high security risks (open doors 24/7) or lost revenue opportunity (closed overnight). SafeMart overcomes this compromise through physical security innovation, maintaining 24/7 service without exposure.
        </p>

        {/* Desktop Interactive Table */}
        <div className="overflow-x-auto border border-white/10 bg-[#070707] mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#0c0c0c] text-white">
                <th className="p-4 text-xs font-mono uppercase tracking-widest text-slate-400">Retail Operator</th>
                <th className="p-4 text-xs font-mono uppercase tracking-widest text-slate-400">Operating Hours</th>
                <th className="p-4 text-xs font-mono uppercase tracking-widest text-slate-400">Night Service Security</th>
                <th className="p-4 text-xs font-mono uppercase tracking-widest text-slate-400">Annual Security Incidents</th>
                <th className="p-4 text-xs font-mono uppercase tracking-widest text-slate-400 text-center">Staff Risk Level</th>
                <th className="p-4 text-xs font-mono uppercase tracking-widest text-slate-400 text-right">Late-Night Revenue Gap</th>
              </tr>
            </thead>
            <tbody>
              {competitorsData.map((comp, idx) => {
                const isSafeMart = comp.name.includes('SafeMart');
                const isHighlighted = highlightSafeMart && isSafeMart;
                
                return (
                  <tr 
                    key={idx}
                    onClick={() => setSelectedComp(comp)}
                    className={`cursor-pointer transition-all border-b border-white/5 hover:bg-white/5 ${
                      isHighlighted 
                        ? 'bg-sky-400/5 border-l-4 border-l-sky-400' 
                        : selectedComp?.name === comp.name 
                        ? 'bg-white/5' 
                        : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="font-serif italic text-base text-white">{comp.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{comp.distance}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-200">
                        <Clock className="w-4 h-4 text-sky-400/70" />
                        <span>{comp.hours}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-slate-300 font-mono">{comp.nightMode}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-full ${comp.badgeColor}`}>
                          {comp.incidents.level} ({comp.incidents.count})
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-xs font-bold ${
                        comp.staffRisk === 'High' ? 'text-rose-400' :
                        comp.staffRisk === 'Medium' ? 'text-yellow-400' :
                        comp.staffRisk === 'Low' ? 'text-sky-400' : 'text-emerald-400'
                      }`}>
                        {comp.staffRisk}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`text-xs font-mono font-bold ${
                        comp.revenueLost.includes('lost') ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {comp.revenueLost}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Operator Deep-Dive Panel */}
        {selectedComp && (
          <motion.div 
            layoutId="competitor-detail"
            className="border border-white/10 bg-gradient-to-r from-[#0a0a0a] to-[#121212] p-8"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-400/10 border border-sky-400/20">
                    <Shield className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Deep-Dive Assessment</h4>
                    <h3 className="text-xl font-serif italic text-white">{selectedComp.name}</h3>
                  </div>
                </div>

                <div className="border border-white/5 bg-black/40 p-4 rounded-none">
                  <p className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Security & Crime Profile
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedComp.incidents.description}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Active Security Safeguards</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedComp.safetyFeatures.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 p-3 border border-white/5">
                      <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-white/5 bg-zinc-900/10 p-6 flex items-start gap-4">
            <ShieldAlert className="w-8 h-8 text-rose-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Standard 24/7 Vulnerability</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Traditional night stores average 12+ major theft/vandalism incidents per year, raising commercial insurance rates by up to 45% and risking employee safety.</p>
            </div>
          </div>
          <div className="border border-white/5 bg-zinc-900/10 p-6 flex items-start gap-4">
            <Clock className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Early Closing Revenue Drain</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Closing at 11:00 PM to avoid risk sacrifices approximately 30-40% of high-margin daily demand, representing an average of $110,000 in lost revenue annually.</p>
            </div>
          </div>
          <div className="border border-white/5 bg-zinc-900/10 p-6 flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white mb-1">The Safe-Window Paradigm</h4>
              <p className="text-xs text-slate-400 leading-relaxed">By shifting to a locked-door walk-up or drive-up window after 10:00 PM, SafeMart completely resolves this dilemma, unlocking safe 24/7 profits.</p>
            </div>
          </div>
        </div>

      </div>
    </motion.section>
  );
};
