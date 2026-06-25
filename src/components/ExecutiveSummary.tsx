import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Target, Wallet } from 'lucide-react';

export const ExecutiveSummary = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24 border border-white/10 bg-zinc-900/30 p-12"
    >
      <div className="flex items-center space-x-4 mb-10 border-b border-white/10 pb-6">
        <h2 className="text-4xl font-light text-white tracking-tighter">1. Executive <span className="font-serif italic text-sky-400">Summary</span></h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <Lightbulb className="w-8 h-8 text-sky-400 mb-6" />
          <h3 className="text-xl font-serif italic text-white mb-4">Concept Overview</h3>
          <p className="text-sm leading-relaxed opacity-70">
            A high-efficiency, quick-stop commuter bodega designed to serve the bustling 36 Ave NW corridor. Combining the speed of a traditional convenience store with the elevated quality of a fresh neighborhood market, we cater to daily routines safely and securely.
          </p>
        </div>
        <div>
          <Target className="w-8 h-8 text-sky-400 mb-6" />
          <h3 className="text-xl font-serif italic text-white mb-4">Value Proposition</h3>
          <p className="text-sm leading-relaxed opacity-70">
            Differentiating through locally sourced items, extended operating hours facilitated by our Night-Portal technology, and a custom grab-and-go foodservice model that meets the demands of modern consumers on the move.
          </p>
        </div>
        <div>
          <Wallet className="w-8 h-8 text-sky-400 mb-6" />
          <h3 className="text-xl font-serif italic text-white mb-4">Funding Request</h3>
          <p className="text-sm leading-relaxed opacity-70">
            Seeking <span className="text-sky-400 font-bold">$150,000</span> in capital from ATB Bank. This is strategically allocated across three core pillars: essential working capital (30%), initial inventory stocking (25%), and specialized security/layout build-out (45%).
          </p>
        </div>
      </div>
    </motion.section>
  );
};
