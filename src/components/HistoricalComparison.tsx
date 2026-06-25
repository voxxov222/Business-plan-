import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, AlertTriangle, ShieldCheck, History } from 'lucide-react';

const data = [
  {
    name: 'Operating Hours/Day',
    'Previous Tenant': 14, // 8 AM - 10 PM
    'SafeMart (24/7)': 24,
  },
  {
    name: 'Avg Daily Revenue ($)',
    'Previous Tenant': 1200,
    'SafeMart (24/7)': 1850,
  },
  {
    name: 'Late-Night Rev ($/Day)',
    'Previous Tenant': 0, // Closed after 10 PM
    'SafeMart (24/7)': 650, // 10 PM - 6 AM
  },
  {
    name: 'Security Incidents/Yr',
    'Previous Tenant': 14,
    'SafeMart (24/7)': 1, // Near zero due to secure window
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050505] border border-white/10 p-4 shadow-xl max-w-xs">
        <p className="font-bold text-white mb-3 text-sm">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex justify-between items-center gap-4">
              <span style={{ color: entry.color }} className="text-xs font-medium">
                {entry.name}
              </span>
              <span className="text-white text-xs font-bold">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const HistoricalComparison = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24"
    >
      <div className="border border-white/10 bg-zinc-900/30 p-8 sm:p-12 mb-8">
        <div className="flex items-center space-x-4 mb-10 border-b border-white/10 pb-6">
          <h2 className="text-4xl font-light text-white tracking-tighter">Site <span className="font-serif italic text-sky-400">Historical Analysis</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <History className="w-6 h-6 text-rose-400" />
              <h3 className="text-xl font-serif italic text-white">Previous Tenant Constraints</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-70 mb-6">
              The previous convenience store at 4412 36 Ave NW operated on a standard 8:00 AM to 10:00 PM schedule. Due to neighborhood dynamics and the risk of late-night theft, the owner could not safely justify staying open past 10:00 PM. This resulted in zero capture of the lucrative late-night market (shift workers, delivery drivers, late-night residents) and a high frequency of shoplifting incidents during evening hours.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="text-xl font-serif italic text-white">The SafeMart Advantage</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-70 mb-6">
              By implementing the Safe-Window infrastructure, SafeMart unlocks the remaining 10 hours of the day. The store transitions to a locked-door, window-service-only model from 10:00 PM to 6:00 AM. This eliminates retail shrinkage (shoplifting), ensures staff safety, and captures an estimated $650/day in uncontested late-night revenue that the previous tenant abandoned.
            </p>
          </div>
        </div>

        <div className="h-[400px] w-full border border-white/5 bg-[#0a0a0a] p-4 sm:p-8 pt-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff', opacity: 0.05 }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Bar dataKey="Previous Tenant" fill="#fb7185" name="Previous Store" radius={[4, 4, 0, 0]} />
              <Bar dataKey="SafeMart (24/7)" fill="#38bdf8" name="SafeMart (With Safe-Window)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="bg-[#0a0a0a] border border-white/5 p-6 text-center">
            <Clock className="w-6 h-6 text-sky-400 mx-auto mb-3" />
            <p className="text-3xl font-light text-white mb-1">+71%</p>
            <p className="text-[10px] uppercase tracking-widest opacity-50">Operating Hours</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 p-6 text-center">
            <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
            <p className="text-3xl font-light text-white mb-1">+$237k</p>
            <p className="text-[10px] uppercase tracking-widest opacity-50">Added Annual Rev</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 p-6 text-center">
            <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto mb-3" />
            <p className="text-3xl font-light text-white mb-1">-93%</p>
            <p className="text-[10px] uppercase tracking-widest opacity-50">Security Incidents</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 p-6 text-center">
            <ShieldCheck className="w-6 h-6 text-sky-400 mx-auto mb-3" />
            <p className="text-3xl font-light text-white mb-1">100%</p>
            <p className="text-[10px] uppercase tracking-widest opacity-50">Staff Safety Rating</p>
          </div>
        </div>

      </div>
    </motion.section>
  );
};
