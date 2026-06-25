import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertTriangle, TrendingUp, ShieldAlert } from 'lucide-react';

const swotData = [
  {
    id: 'strengths',
    title: 'Strengths',
    icon: <ShieldCheck className="w-8 h-8 text-sky-400" />,
    color: 'border-sky-400',
    textColor: 'text-sky-400',
    details: [
      'Zero late-night robbery risk with Safe-Window model',
      'Lower insurance premiums due to enhanced security',
      'Minimal staff required for late-night operations',
      'Strong appeal in high-density urban areas'
    ]
  },
  {
    id: 'weaknesses',
    title: 'Weaknesses',
    icon: <AlertTriangle className="w-8 h-8 text-fuchsia-400" />,
    color: 'border-fuchsia-400',
    textColor: 'text-fuchsia-400',
    details: [
      'Higher initial capital requirement for window installation',
      'No in-store browsing during night shifts limits impulse buys',
      'Customer learning curve for walk-up interactions',
      'Weather dependent (rain/snow may deter walk-up traffic)'
    ]
  },
  {
    id: 'opportunities',
    title: 'Opportunities',
    icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
    color: 'border-emerald-400',
    textColor: 'text-emerald-400',
    details: [
      'Capture uncontested late-night market share in food deserts',
      'Partnerships with delivery apps (UberEats/DoorDash) via window',
      'Franchise model expansion to other high-risk neighborhoods',
      'Introduce high-margin hot food options'
    ]
  },
  {
    id: 'threats',
    title: 'Threats',
    icon: <ShieldAlert className="w-8 h-8 text-rose-400" />,
    color: 'border-rose-400',
    textColor: 'text-rose-400',
    details: [
      'Local zoning restrictions on 24-hour exterior operations',
      'Competitors adopting similar window models',
      'Vandalism to the exterior structure or window',
      'Economic downturn affecting late-night discretionary spending'
    ]
  }
];

const FlipCard = ({ data }: { data: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group relative h-80 w-full cursor-pointer"
      style={{ perspective: 1000 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div 
        className="w-full h-full relative duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 border border-white/10 bg-zinc-900/30 p-8 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="mb-6 bg-[#0a0a0a] p-6 rounded-full border border-white/5">
            {data.icon}
          </div>
          <h3 className="text-2xl font-light text-white tracking-widest uppercase">{data.title}</h3>
          <p className="mt-4 text-[10px] tracking-widest uppercase text-white/40 group-hover:text-sky-400 transition-colors">Hover to reveal</p>
        </div>

        {/* Back */}
        <div 
          className={`absolute inset-0 border-t-4 ${data.color} bg-[#111] p-8 flex flex-col justify-center shadow-xl`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <h3 className="text-xl font-serif italic text-white mb-6 border-b border-white/10 pb-4">{data.title}</h3>
          <ul className="space-y-4">
            {data.details.map((detail: string, index: number) => (
              <li key={index} className="flex items-start text-sm opacity-80 text-white">
                <span className={`mr-3 mt-0.5 ${data.textColor}`}>▪</span>
                <span className="leading-relaxed">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export const SWOTAnalysis = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24"
    >
      <div className="flex items-center space-x-4 mb-12 border-b border-white/10 pb-6">
        <h2 className="text-4xl font-light text-white tracking-tighter">SWOT <span className="font-serif italic text-sky-400">Analysis</span></h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {swotData.map((item) => (
          <FlipCard key={item.id} data={item} />
        ))}
      </div>
    </motion.section>
  );
};
