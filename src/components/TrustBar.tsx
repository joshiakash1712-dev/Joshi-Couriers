import React, { useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';

export const TrustBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(barRef.current, {
          y: 12,
          duration: 0.45,
          ease: 'power2.out',
          clearProps: 'all',
        });
      });
    },
    { scope: barRef }
  );

  return (
    <div 
      ref={barRef}
      className="w-full bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100/90 dark:border-blue-900/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm transition-colors duration-200"
    >
      {/* Left Title */}
      <div className="flex items-center gap-2.5 text-[#0038BD] dark:text-blue-400 font-black">
        <ShieldCheck className="w-5 h-5 text-[#0038BD] dark:text-blue-400 fill-[#0038BD]/15" />
        <span>Trusted Local Service</span>
      </div>

      {/* Bullet Points */}
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 sm:gap-x-4 gap-y-1 text-slate-700 dark:text-slate-300 font-semibold text-center">
        <span>No Central Sorting</span>
        <span className="text-[#0038BD] dark:text-blue-400 font-black">•</span>
        <span>Hand-to-Hand Delivery</span>
        <span className="text-[#0038BD] dark:text-blue-400 font-black">•</span>
        <span>Timely &amp; Safe</span>
      </div>
    </div>
  );
};
