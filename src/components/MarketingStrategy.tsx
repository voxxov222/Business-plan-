import React from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Megaphone, Target, Users, Smartphone } from 'lucide-react';

const budgetData = [
  { name: 'Exterior Signage & Visibility', value: 4000, color: '#38bdf8' },
  { name: 'Local SEO & Digital Ads', value: 3000, color: '#818cf8' },
  { name: 'Community Promos & Print', value: 1500, color: '#34d399' },
  { name: 'Delivery App Promotions', value: 1500, color: '#f472b6' },
];

const strategies = [
  {
    title: 'Geo-Targeted Digital Ads',
    icon: <Target className="w-6 h-6 text-sky-400" />,
    description: 'Targeted ads on social media and Google within a 5km radius of 4412 36 Ave NW, specifically timed for evening and late-night hours.'
  },
  {
    title: 'High-Visibility Signage',
    icon: <Megaphone className="w-6 h-6 text-sky-400" />,
    description: 'Bright, energy-efficient LED signage highlighting the 24/7 Safe-Window to attract late-night drive-by and walk-up traffic.'
  },
  {
    title: 'Delivery App Partnerships',
    icon: <Smartphone className="w-6 h-6 text-sky-400" />,
    description: 'Partnering with UberEats and DoorDash for late-night convenience delivery, using the window for rapid, secure courier handoffs.'
  },
  {
    title: 'Community Engagement',
    icon: <Users className="w-6 h-6 text-sky-400" />,
    description: 'Direct mailers and promotional discounts for local residents and essential workers (nurses, first responders) to build neighborhood loyalty.'
  }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#050505] border border-white/10 p-3 shadow-xl">
        <p className="font-bold text-white text-sm">{data.name}</p>
        <p className="text-sky-400 font-medium text-xs mt-1">
          Budget: ${data.value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const MarketingStrategy = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24"
    >
      <div className="border border-white/10 bg-zinc-900/30 p-12 mb-8">
        <div className="flex items-center space-x-4 mb-10 border-b border-white/10 pb-6">
          <h2 className="text-4xl font-light text-white tracking-tighter">5. Marketing Strategy & <span className="font-serif italic text-sky-400">Budget</span></h2>
        </div>

        <p className="text-sm leading-relaxed opacity-70 mb-10 max-w-4xl">
          Our marketing strategy focuses on hyper-local awareness, leveraging the unique Safe-Window concept as a differentiator. The goal is to establish SafeMart as the premier, safest, and most reliable late-night convenience destination in the Edmonton area. We have allocated a $10,000 initial marketing launch budget.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {strategies.map((strategy, index) => (
            <div key={index} className="border border-white/5 bg-[#0a0a0a] p-8 hover:border-sky-400/30 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-sky-400/10 p-3 rounded-full border border-sky-400/20">
                  {strategy.icon}
                </div>
                <h3 className="text-lg font-serif italic text-white">{strategy.title}</h3>
              </div>
              <p className="text-sm opacity-70 leading-relaxed">
                {strategy.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-white/10 pt-12">
          <div>
            <h3 className="text-2xl font-light text-white mb-6 tracking-tight">Initial Launch Budget <span className="text-sky-400 font-bold">$10,000</span></h3>
            <div className="space-y-4">
              {budgetData.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-white/80">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-white">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', opacity: 0.8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
