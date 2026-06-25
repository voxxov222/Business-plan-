import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cpu, X, FileText, ShieldAlert } from 'lucide-react';
import { SafetyWindowScene } from './SafetyWindowScene';
import { InteractiveBlueprint } from './InteractiveBlueprint';
import { IncidentSimulatorOverlay } from './IncidentSimulatorOverlay';
import { trackSpecViewed, trackSimOpened } from '../lib/engagement';

export const OperationsTech = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIncidentSimOpen, setIsIncidentSimOpen] = useState(false);

  const handleOpenSpecs = () => {
    setIsModalOpen(true);
    trackSpecViewed();
  };

  const handleOpenSim = () => {
    setIsIncidentSimOpen(true);
    trackSimOpened();
  };

  return (
    <>
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <div className="border border-white/10 bg-zinc-900/30 p-12 mb-8">
          <div className="flex items-center space-x-4 mb-10 border-b border-white/10 pb-6">
            <h2 className="text-4xl font-light text-white tracking-tighter">4. Operations & <span className="font-serif italic text-sky-400">Technology</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-6 h-6 text-sky-400" />
                <h3 className="text-xl font-serif italic text-white">Technology Focus</h3>
              </div>
              <p className="text-sm leading-relaxed opacity-70 mb-6">
                We leverage a cloud-based Point-of-Sale (POS) system integrated with automated inventory tracking. This ensures real-time stock visibility, minimizing perishable waste and guaranteeing that top-selling items are always available. Predictive ordering algorithms reduce manual administrative overhead by 40%.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-sky-400" />
                <h3 className="text-xl font-serif italic text-white">Security Infrastructure</h3>
              </div>
              <p className="text-sm leading-relaxed opacity-70 mb-6">
                Beyond the physical Night-Portal window, the perimeter is secured by high-lumen LED floodlighting and 4K AI-monitored camera systems. Late-night shifts operate under strict lockdown protocols—staff remain in a secure, bullet-resistant enclosure, fulfilling orders exclusively through the portal.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-white/10">
          <div className="col-span-12 lg:col-span-4 bg-sky-400 text-black p-12 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center text-xl font-serif text-black mb-8">
              01
            </div>
            <h3 className="text-3xl font-serif italic text-black mb-6">The Safe-Window Solution</h3>
            <p className="text-sm leading-relaxed opacity-90 font-medium mb-8">
              After 10:00 PM, main doors lock. All transactions occur through the reinforced walk-up window. Customers request products, staff safely fulfill orders. Eliminates robbery risk while capturing the lucrative late-night market.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={handleOpenSpecs}
                className="flex-1 flex items-center justify-center space-x-2 bg-black text-sky-400 hover:bg-zinc-900 px-4 py-3 text-[10px] tracking-widest font-bold uppercase border border-sky-400/20 transition-colors"
                id="view-safety-specs-btn"
              >
                <FileText className="w-4 h-4" />
                <span>View Specs</span>
              </button>
              <button
                onClick={handleOpenSim}
                className="flex-1 flex items-center justify-center space-x-2 bg-zinc-950 text-red-400 hover:bg-zinc-900 border border-red-500/30 px-4 py-3 text-[10px] tracking-widest font-bold uppercase transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                id="simulate-incident-btn"
              >
                <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
                <span>Lockdown Sim</span>
              </button>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8 w-full">
            <SafetyWindowScene />
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-[#080a11] border border-sky-950 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110]"
              >
                <X className="w-6 h-6" />
              </button>
              
              <InteractiveBlueprint />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <IncidentSimulatorOverlay 
        isOpen={isIncidentSimOpen} 
        onClose={() => setIsIncidentSimOpen(false)} 
      />
    </>
  );
};
