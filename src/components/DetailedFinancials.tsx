import React from 'react';
import { motion } from 'motion/react';
import { ProfitabilityChart3D, GrowthChart3D } from './FinancialCharts3D';
import { FinancialCharts } from './Charts';

export const DetailedFinancials = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24"
    >
      <div className="border border-white/10 bg-zinc-900/30 p-12 mb-8">
        <div className="flex items-center space-x-4 mb-10 border-b border-white/10 pb-6">
          <h2 className="text-4xl font-light text-white tracking-tighter">5. Financial Plan & <span className="font-serif italic text-sky-400">Projections</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-4">Start-Up Capital Breakdown</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="opacity-70">Commercial Refrigeration</span>
                <span className="font-mono text-white">$45,000</span>
              </li>
              <li className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="opacity-70">Night-Portal & Security Build-out</span>
                <span className="font-mono text-white">$65,000</span>
              </li>
              <li className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="opacity-70">Initial Inventory Setup</span>
                <span className="font-mono text-white">$25,000</span>
              </li>
              <li className="flex justify-between items-center text-sm pb-2">
                <span className="opacity-70">Permits & Licensing</span>
                <span className="font-mono text-white">$15,000</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-4">Monthly Operating Expenses</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="opacity-70">Commercial Rent (4405 36 Ave NW)</span>
                <span className="font-mono text-white">$4,200</span>
              </li>
              <li className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="opacity-70">Utilities & Insurance</span>
                <span className="font-mono text-white">$1,800</span>
              </li>
              <li className="flex justify-between items-center text-sm pb-2">
                <span className="opacity-70">Employee Wages (Lean Model)</span>
                <span className="font-mono text-white">$8,500</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-sm leading-relaxed opacity-70">
            <strong>5-Year Forecast Strategy:</strong> Our cash flow forecasts indicate reaching the break-even point by Month 14. This accelerated timeline is made possible by our significantly reduced late-night staffing costs and lower insurance premiums granted by the implementation of the Night-Portal. By Year 2, operational growth stabilizes as our high-margin foodservice offerings capture a larger share of the commuter market.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <ProfitabilityChart3D />
        <GrowthChart3D />
      </div>

      <FinancialCharts />
    </motion.section>
  );
};
