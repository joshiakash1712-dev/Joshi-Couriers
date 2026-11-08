import React, { useRef } from 'react';
import { Clock, Handshake, ShieldCheck, CheckCircle, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';

export const BusinessFeatures: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Safe GSAP enhancement: never hide content with autoAlpha: 0
        // Content is 100% visible immediately, providing subtle entry motion
        gsap.from('.feature-card', {
          y: 16,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'all',
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full"
    >
      {/* Card 1: Next Morning Delivery */}
      <div 
        className="feature-card bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-5 sm:p-6 flex flex-col justify-between text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-[#0038BD] dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/60">
              <Clock className="w-6 h-6" strokeWidth={2.2} />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#0038BD] dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              Daily 6:30-8:30 AM
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 mb-2">
            Next Morning Delivery
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            We start at 4-5 AM daily from Jalna and reach Partur by <strong className="font-bold text-slate-900 dark:text-slate-200">6:00-6:30 AM</strong>. All merchant deliveries are completed right as shops open between <strong className="font-bold text-slate-900 dark:text-slate-200">6:30-8:30 AM</strong>.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <CheckCircle className="w-3.5 h-3.5 text-[#0038BD] dark:text-blue-400 shrink-0" />
          <span>Before business hours guaranteed</span>
        </div>
      </div>

      {/* Card 2: Business Focused */}
      <div 
        className="feature-card bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-5 sm:p-6 flex flex-col justify-between text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/60">
              <Handshake className="w-6 h-6" strokeWidth={2.2} />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50">
              B2B &amp; Merchant Hubs
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 mb-2">
            Business &amp; Wholesale Focused
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Specialized for textile merchants, auto parts distributors, book stores, pharmacies, and courier partners. No fragile parcel handovers through multiple central sorting hubs.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Zero transshipment breakage</span>
        </div>
      </div>

      {/* Card 3: Personal & Reliable */}
      <div 
        className="feature-card bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-5 sm:p-6 flex flex-col justify-between text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-[#EF8E01] flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/60">
              <ShieldCheck className="w-6 h-6" strokeWidth={2.2} />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-900/50">
              Father &amp; Son Service
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 mb-2">
            Personal &amp; Reliable Handover
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Directly operated by Anant Joshi and his son (Akash Joshi) in their own vehicle (MH21 V 6370). Complete personal accountability, direct phone communication, and payment on delivery.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <CheckCircle className="w-3.5 h-3.5 text-[#EF8E01] shrink-0" />
          <span>Pay on arrival with Cash or UPI</span>
        </div>
      </div>
    </div>
  );
};
