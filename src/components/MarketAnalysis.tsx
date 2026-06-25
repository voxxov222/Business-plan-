import React from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp, Crosshair, Store, ShieldAlert } from 'lucide-react';

export const MarketAnalysis = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24 border border-white/10 bg-gradient-to-br from-transparent to-sky-900/10 p-12"
    >
      <div className="flex items-center space-x-4 mb-10 border-b border-white/10 pb-6">
        <h2 className="text-4xl font-light text-white tracking-tighter">2. Market & Industry <span className="font-serif italic text-sky-400">Analysis</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="col-span-12 md:col-span-4 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-sky-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Target Audience</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              Our primary demographic comprises Edmonton daily commuters navigating the 36 Ave NW artery, local high school and university students seeking quick meals, and neighborhood families needing emergency essentials.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Crosshair className="w-5 h-5 text-sky-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Competitor Advantage</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              While nearby competitors close early or suffer high attrition due to safety concerns, our layout and Night-Portal allow 24-hour revenue generation. We offer premium product variety at competitive pricing, backed by a superior safety record.
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 bg-sky-400 text-black p-8 flex flex-col justify-center">
          <TrendingUp className="w-12 h-12 mb-6" />
          <h3 className="text-3xl font-serif italic mb-4">2026 Industry Trends</h3>
          <p className="text-lg leading-relaxed font-medium mb-6">
            According to recent Datassential 2026 reporting, <span className="font-bold underline decoration-black/30 underline-offset-4">60% of convenience store sales growth</span> is now driven entirely by enhanced foodservice offerings.
          </p>
          <p className="text-sm opacity-90">
            We are pivoting aggressively into this space, prioritizing high-margin, made-to-order burritos, artisan breakfast sandwiches, and premium craft coffee over stagnant traditional dry goods.
          </p>
        </div>
      </div>

      {/* Neighborhood Reliance & Safety Portal Section */}
      <div className="mt-12 pt-12 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="neighborhood-reliance-portal">
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <Store className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-widest font-bold font-mono">Neighborhood Service Vacuum</span>
          </div>
          <h3 className="text-2xl font-light text-white tracking-tight leading-snug">
            Critical Community Reliance & <br/>
            <span className="font-serif italic text-sky-400">Market Opportunity</span>
          </h3>
          <p className="text-sm leading-relaxed opacity-70">
            The surrounding Edmonton neighborhood relies heavily on a local retail anchor for daily grocery necessities, transit-aligned quick stops, and emergency household essentials. As multiple traditional operators shut down or scale back operations due to unchecked security threats and unsustainable overnight shrink, a severe service vacuum has emerged. 
          </p>
        </div>
        
        <div className="lg:col-span-7 bg-[#050507] border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">The Safety Portal: The Key to Threat Reduction</h4>
            <p className="text-xs leading-relaxed opacity-70">
              The high demand for a convenience anchor in this location is undeniable. However, reopening an open-door format would expose staff to the exact threat profile that forced prior brand closures. 
            </p>
            <p className="text-xs leading-relaxed text-sky-400 font-semibold">
              Implementing our secure Safe-Window Night Portal resolves this core issue. By removing late-night entry vectors, we reduce physical security threats to near-zero, enabling uninterrupted 24/7 service uptime to capture 100% of the active market demand.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
