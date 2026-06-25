import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export const data = [
  { month: 'Jan', revenue: 4000, overhead: 1200, profit: 2800 },
  { month: 'Feb', revenue: 4500, overhead: 1200, profit: 3300 },
  { month: 'Mar', revenue: 4800, overhead: 1200, profit: 3600 },
  { month: 'Apr', revenue: 5200, overhead: 1250, profit: 3950 },
  { month: 'May', revenue: 6000, overhead: 1250, profit: 4750 },
  { month: 'Jun', revenue: 7500, overhead: 1300, profit: 6200 },
];

export const FinancialCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-8">
      {/* Area Chart for Revenue vs Profit */}
      <div className="bg-zinc-900/30 border border-white/10 p-8 flex flex-col">
        <h3 className="text-[10px] opacity-40 uppercase tracking-widest mb-1">Monthly Growth</h3>
        <p className="text-xl font-light text-white mb-8">Revenue & Profit Progression</p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.1} vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#38bdf8" fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="profit" stroke="#818cf8" fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart for Overhead */}
      <div className="bg-zinc-900/30 border border-white/10 p-8 flex flex-col">
        <h3 className="text-[10px] opacity-40 uppercase tracking-widest mb-1">Cost Structure</h3>
        <p className="text-xl font-light text-white mb-8">Low Overhead Strategy Validation</p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.1} vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc' }}
                cursor={{ fill: '#ffffff', opacity: 0.05 }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="overhead" name="Fixed Overhead" fill="#cbd5e1" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
