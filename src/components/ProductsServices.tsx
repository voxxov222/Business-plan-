import React from 'react';
import { motion } from 'motion/react';
import { Package, Map } from 'lucide-react';
import { StoreModelViewer } from './StoreModel';

export const ProductsServices = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24"
    >
      <div className="border border-white/10 bg-zinc-900/30 p-12 mb-8">
        <div className="flex items-center space-x-4 mb-10 border-b border-white/10 pb-6">
          <h2 className="text-4xl font-light text-white tracking-tighter">3. Products & <span className="font-serif italic text-sky-400">Services</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-sky-400" />
              <h3 className="text-xl font-serif italic text-white">Core Inventory Strategy</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex justify-between items-start text-sm border-b border-white/5 pb-4">
                <span className="font-bold text-white w-1/3">Everyday Essentials</span>
                <span className="opacity-70 w-2/3">High-turnover staples (dairy, bread, hygiene) anchoring daily visits.</span>
              </li>
              <li className="flex justify-between items-start text-sm border-b border-white/5 pb-4">
                <span className="font-bold text-white w-1/3">Grab-and-Go</span>
                <span className="opacity-70 w-2/3">Fresh prepared meals targeting the commuter lunch rush.</span>
              </li>
              <li className="flex justify-between items-start text-sm border-b border-white/5 pb-4">
                <span className="font-bold text-white w-1/3">Impulse Buys</span>
                <span className="opacity-70 w-2/3">High-margin snacks and electronics positioned strategically at checkout.</span>
              </li>
              <li className="flex justify-between items-start text-sm pb-2">
                <span className="font-bold text-white w-1/3">Premium Beverages</span>
                <span className="opacity-70 w-2/3">Craft sodas, energy drinks, and a specialized espresso bar.</span>
              </li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Map className="w-6 h-6 text-sky-400" />
              <h3 className="text-xl font-serif italic text-white">Layout Optimization</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-70 mb-6">
              Our floor plan is engineered for psychological flow and maximum revenue. Following conventional retail wisdom, high-margin fresh produce and bakery items greet customers at the entrance, establishing a premium perception. The pathing forces navigation past essential goods, terminating at the secure checkout counter heavily stocked with impulse items.
            </p>
          </div>
        </div>
      </div>

      <div className="border border-white/10 mb-8">
        <StoreModelViewer />
      </div>
    </motion.section>
  );
};
