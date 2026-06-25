import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, HeartPulse, MapPin, Store, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';

const hourlyDemandData = [
  { hour: '06:00', 'Local Demand (Units)': 45, 'Traditional Store Access': 45, 'SafeMart 24/7 Access': 45 },
  { hour: '08:00', 'Local Demand (Units)': 85, 'Traditional Store Access': 85, 'SafeMart 24/7 Access': 85 },
  { hour: '10:00', 'Local Demand (Units)': 95, 'Traditional Store Access': 95, 'SafeMart 24/7 Access': 95 },
  { hour: '12:00', 'Local Demand (Units)': 110, 'Traditional Store Access': 110, 'SafeMart 24/7 Access': 110 },
  { hour: '14:00', 'Local Demand (Units)': 90, 'Traditional Store Access': 90, 'SafeMart 24/7 Access': 90 },
  { hour: '16:00', 'Local Demand (Units)': 125, 'Traditional Store Access': 125, 'SafeMart 24/7 Access': 125 },
  { hour: '18:00', 'Local Demand (Units)': 140, 'Traditional Store Access': 140, 'SafeMart 24/7 Access': 140 },
  { hour: '20:00', 'Local Demand (Units)': 115, 'Traditional Store Access': 115, 'SafeMart 24/7 Access': 115 },
  { hour: '22:00', 'Local Demand (Units)': 85, 'Traditional Store Access': 0, 'SafeMart 24/7 Access': 85 }, // Previous store closes at 10 PM
  { hour: '00:00', 'Local Demand (Units)': 65, 'Traditional Store Access': 0, 'SafeMart 24/7 Access': 65 },
  { hour: '02:00', 'Local Demand (Units)': 40, 'Traditional Store Access': 0, 'SafeMart 24/7 Access': 40 },
  { hour: '04:00', 'Local Demand (Units)': 35, 'Traditional Store Access': 0, 'SafeMart 24/7 Access': 35 },
];

const impactMetrics = [
  {
    title: "Grey Nuns Proximity Demand",
    value: "2,200+",
    detail: "Night-shift healthcare personnel, emergency responders, and hospital visitors active 10 PM - 6 AM daily within a 3-minute drive.",
    icon: HeartPulse,
    color: "text-rose-400"
  },
  {
    title: "Neighborhood Food Desert",
    value: "8,500+",
    detail: "Edmonton Mill Woods residents lacking walking-distance access to a basic fresh-convenience retailer after previous store closures.",
    icon: Users,
    color: "text-sky-400"
  },
  {
    title: "Commute Service Gap",
    value: "4.2 km",
    detail: "Average extra distance residents must travel over transit lines to reach the nearest open midnight grocery or basic convenience hub.",
    icon: MapPin,
    color: "text-amber-400"
  },
  {
    title: "Secure Night Uptime",
    value: "100%",
    detail: "Late-night sales fulfilled via secure Safe-Window, keeping staff isolated from active threat vectors and eliminating cash drawer risk.",
    icon: ShieldCheck,
    color: "text-emerald-400"
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050505] border border-white/10 p-4 shadow-xl max-w-xs font-mono">
        <p className="font-bold text-white mb-2 text-xs">Hour: {label}</p>
        <div className="space-y-1.5 text-[11px]">
          {payload.map((entry: any, index: number) => {
            const isDemand = entry.name.includes('Demand');
            const color = isDemand ? '#f59e0b' : entry.color;
            return (
              <div key={`item-${index}`} className="flex justify-between items-center gap-4">
                <span style={{ color }} className="opacity-90">
                  {entry.name}:
                </span>
                <span className="text-white font-bold">
                  {entry.value} index
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export const CommunityImpact = () => {
  const [activeTab, setActiveTab] = useState<'gap' | 'hospital' | 'sustainability'>('gap');

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24"
      id="community-impact"
    >
      <div className="border border-white/10 bg-zinc-900/30 p-8 sm:p-12 mb-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full filter blur-[100px] -z-10" />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-sky-400 font-bold font-mono">Socio-Economic Feasibility // Area 4412 NW</span>
            <h2 className="text-4xl font-light text-white tracking-tighter">
              Community <span className="font-serif italic text-sky-400">Impact Analysis</span>
            </h2>
          </div>
          <div className="flex bg-[#050507] border border-white/10 p-1 self-start font-mono text-[10px]">
            <button 
              onClick={() => setActiveTab('gap')} 
              className={`px-4 py-2 uppercase font-bold transition-all cursor-pointer ${activeTab === 'gap' ? 'bg-sky-400 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              Service Gap
            </button>
            <button 
              onClick={() => setActiveTab('hospital')} 
              className={`px-4 py-2 uppercase font-bold transition-all cursor-pointer ${activeTab === 'hospital' ? 'bg-sky-400 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              Hospital Demand
            </button>
            <button 
              onClick={() => setActiveTab('sustainability')} 
              className={`px-4 py-2 uppercase font-bold transition-all cursor-pointer ${activeTab === 'sustainability' ? 'bg-sky-400 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              Sustainability Model
            </button>
          </div>
        </div>

        {/* Narrative Section based on active tab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12">
          <div className="lg:col-span-5 space-y-6">
            {activeTab === 'gap' && (
              <motion.div 
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-mono uppercase tracking-widest">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>The Service Vacuum Gap</span>
                </div>
                <h3 className="text-2xl font-light text-white tracking-tight leading-snug">
                  Previous Closures Left <br/>
                  <span className="font-serif italic text-sky-400">An Active Neighborhood Desert</span>
                </h3>
                <p className="text-sm leading-relaxed opacity-70">
                  Following the sudden closure of the neighborhood's former standard-format retail option at 4412 36 Ave NW, a profound service void opened. Standard operators could not maintain safety margins during late-night shifts due to elevated security threats, leaving local residents without essential goods.
                </p>
                <p className="text-sm leading-relaxed opacity-70">
                  During peak demand hours, residents are forced to drive long distances or utilize multiple bus routes to obtain simple items like transit tickets, pharmacy staples, and basic groceries, hitting those without personal vehicles hardest.
                </p>
              </motion.div>
            )}

            {activeTab === 'hospital' && (
              <motion.div 
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-mono uppercase tracking-widest">
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>Edmonton Health Corridor</span>
                </div>
                <h3 className="text-2xl font-light text-white tracking-tight leading-snug">
                  Grey Nuns Hospital & <br/>
                  <span className="font-serif italic text-sky-400">Late-Night Shift Workers</span>
                </h3>
                <p className="text-sm leading-relaxed opacity-70">
                  Located just minutes from the Grey Nuns Community Hospital, this site serves as a vital corridor for shift-based medical professionals. Nurses, residents, and support staff finishing grueling shifts at 11:00 PM, 3:00 AM, or starting early at 6:00 AM represent a continuous, highly stable market segment.
                </p>
                <p className="text-sm leading-relaxed opacity-70">
                  The previous business model abandoned this segment entirely by shutting its doors at 10:00 PM. SafeMart taps into this massive local customer base, offering them a reliable, warm, well-lit safety anchor for food and supplies at any hour of the night.
                </p>
              </motion.div>
            )}

            {activeTab === 'sustainability' && (
              <motion.div 
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Zero-Risk Business Model</span>
                </div>
                <h3 className="text-2xl font-light text-white tracking-tight leading-snug">
                  SafeMart Night Portal <br/>
                  <span className="font-serif italic text-sky-400">Solves the Sustainability Equation</span>
                </h3>
                <p className="text-sm leading-relaxed opacity-70">
                  Unlike traditional convenience models that expose the entire storefront, registers, and personnel to entry vectors overnight, SafeMart utilizes a secure architectural Safe-Window Night Portal between 10:00 PM and 6:00 AM.
                </p>
                <p className="text-sm leading-relaxed opacity-70">
                  This eliminates high-risk scenarios and night-time retail shrink entirely. The result is a highly profitable, self-sustaining community utility that can remain operating indefinitely, offering safety to staff and continuity of services to the neighborhood.
                </p>
              </motion.div>
            )}

            {/* Quick Summary Line */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <Store className="w-5 h-5 text-sky-400" />
              <p className="text-xs italic text-slate-300">
                SafeMart turns a high-risk security hazard into a highly secure community resource.
              </p>
            </div>
          </div>

          {/* Recharts Area Chart contrasting Demand vs Access */}
          <div className="lg:col-span-7 space-y-4">
            <div className="border border-white/10 bg-[#07080c] p-6 relative">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-white">Demand vs. Access Corridor</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">COMPARING HOURLY TARGET CONVENIENCE DEMAND INDEX</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-amber-500/30 border border-amber-400" />
                    <span className="text-slate-400">Neighborhood Demand</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-rose-500/30 border border-rose-400" />
                    <span className="text-slate-400">Previous Access</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-sky-500/30 border border-sky-400" />
                    <span className="text-slate-400">SafeMart Access</span>
                  </div>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={hourlyDemandData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorTraditional" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#fb7185" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorSafeMart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                    <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="Local Demand (Units)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorDemand)" strokeWidth={1.5} name="Hourly Local Demand" />
                    <Area type="monotone" dataKey="Traditional Store Access" stroke="#fb7185" fillOpacity={1} fill="url(#colorTraditional)" strokeWidth={1} strokeDasharray="4 4" name="Traditional Store Access" />
                    <Area type="monotone" dataKey="SafeMart 24/7 Access" stroke="#38bdf8" fillOpacity={1} fill="url(#colorSafeMart)" strokeWidth={2} name="SafeMart 24/7 Access" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Chart Overlay Label / Callout */}
              <div className="absolute bottom-16 right-12 bg-black/80 border border-white/10 px-3 py-1.5 font-mono text-[9px] text-slate-300 max-w-[200px] pointer-events-none">
                <span className="text-rose-400 font-bold uppercase block">10 PM - 6 AM Gaps:</span>
                100% Demand Unsatisfied previously. SafeMart bridges this gap with 24/7 Portal Service.
              </div>
            </div>
          </div>
        </div>

        {/* 4 Grid Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-white/10">
          {impactMetrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="bg-zinc-950/40 border border-white/5 p-6 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-4xl font-light text-white tracking-tight`}>{m.value}</span>
                  <div className={`p-2 bg-white/5 border border-white/10 rounded-none ${m.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="text-xs font-mono font-bold uppercase text-white mb-2">{m.title}</h4>
                <p className="text-[11px] leading-relaxed text-slate-400">{m.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};
