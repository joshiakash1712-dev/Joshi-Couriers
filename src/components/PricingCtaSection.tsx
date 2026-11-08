import React, { useRef } from 'react';
import { Tag, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';

interface PricingCtaSectionProps {
  onOpenBooking: () => void;
}

export const PricingCtaSection: React.FC<PricingCtaSectionProps> = ({ onOpenBooking }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
            once: true,
          },
          defaults: { ease: 'power3.out' },
        });

        tl.from('.pricing-box', {
          y: 16,
          duration: 0.5,
          clearProps: 'all',
        })
          .from(
            '.price-number',
            {
              scale: 0.9,
              duration: 0.4,
              ease: 'back.out(1.8)',
              clearProps: 'all',
            },
            '-=0.2'
          )
          .from(
            '.cta-action-btn',
            {
              y: 12,
              stagger: 0.08,
              duration: 0.4,
              clearProps: 'all',
            },
            '-=0.3'
          );
      });
    },
    { scope: containerRef }
  );

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch"
    >
      {/* Left Column (lg:col-span-8): Honest Pricing & Payment Rules */}
      <div className="pricing-box lg:col-span-8 bg-[#f2fbf5] dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 flex flex-col justify-between transition-colors duration-200">
        
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center">
          
          {/* Main Price Numbers */}
          <div className="sm:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold">
              <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Pricing (From Jalna → Partur)</span>
            </div>
            
            <div className="price-number text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              ₹70 - ₹130
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              ₹70 base fare. Price may vary beyond Partur based on destination &amp; parcel size/weight.
            </p>
          </div>

          {/* Payment & Security Checklist */}
          <div className="sm:col-span-5 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xs rounded-xl p-3.5 sm:p-4 border border-emerald-100/80 dark:border-emerald-900/60 space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="pricing-check-item flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3] shrink-0" />
              <span>Cash / UPI on delivery</span>
            </div>
            <div className="pricing-check-item flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3] shrink-0" />
              <span>No advance payment</span>
            </div>
            <div className="pricing-check-item flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3] shrink-0" />
              <span>Safe &amp; secure handling</span>
            </div>
          </div>

        </div>

      </div>

      {/* Right Column (lg:col-span-4): Direct Booking & WhatsApp Actions */}
      <div className="lg:col-span-4 flex flex-col justify-center gap-3">
        
        {/* Dominant Primary Booking CTA */}
        <button
          onClick={onOpenBooking}
          id="main-book-doorstep-pickup-btn"
          className="cta-action-btn w-full h-14 sm:h-14 px-6 rounded-2xl bg-[#EF8E01] hover:bg-[#d88001] active:scale-[0.98] text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-md shadow-[#EF8E01]/25 hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-[#EF8E01]/30"
        >
          <span>Book Doorstep Pickup</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Clear Secondary WhatsApp CTA */}
        <a
          href="https://wa.me/919404040606?text=Hi%20Joshi%20Couriers,%20I%20want%20to%20book%20a%20parcel%20pickup%20from%20Jalna."
          target="_blank"
          rel="noopener noreferrer"
          id="main-whatsapp-btn"
          className="cta-action-btn w-full h-12 sm:h-12 px-6 rounded-2xl bg-white dark:bg-slate-900 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 active:scale-[0.98] text-slate-800 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-300 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-600 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xs transition-all duration-150"
        >
          <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366]/20" />
          <span>Chat on WhatsApp</span>
        </a>

      </div>

    </div>
  );
};
