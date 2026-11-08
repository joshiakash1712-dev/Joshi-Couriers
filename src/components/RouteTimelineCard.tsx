import React, { useRef } from 'react';
import { ArrowRight, Clock, Landmark, Building2, Store, Truck } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';

export const RouteTimelineCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const vanIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Master scroll-triggered timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 90%',
            once: true,
          },
          defaults: { ease: 'power3.out' },
        });

        tl.from(cardRef.current, {
          y: 20,
          duration: 0.5,
          clearProps: 'all',
        })
          .from(
            '.route-stop-node',
            {
              scale: 0.85,
              y: 12,
              stagger: 0.1,
              duration: 0.45,
              ease: 'back.out(1.7)',
              clearProps: 'all',
            },
            '-=0.2'
          )
          // Animate the highway route track line filling
          .fromTo(
            progressLineRef.current,
            { width: '0%' },
            {
              width: '100%',
              duration: 1.0,
              ease: 'power2.inOut',
            },
            '-=0.2'
          )
          // Move the courier van indicator along the highway route from Jalna toward Partur
          .fromTo(
            vanIndicatorRef.current,
            { left: '0%' },
            {
              left: '52%', // stopping at Partur
              duration: 1.0,
              ease: 'power2.inOut',
            },
            '<'
          )
          .from(
            '.delivery-window-box',
            {
              x: 16,
              duration: 0.45,
              clearProps: 'all',
            },
            '-=0.4'
          );

        // Continuous subtle forward nudge on route connecting arrows
        gsap.to('.route-connecting-arrow', {
          x: 4,
          duration: 0.9,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
          stagger: 0.2,
        });
      });
    },
    { scope: cardRef }
  );

  return (
    <div 
      ref={cardRef}
      className="relative w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-6 lg:p-7 transition-colors duration-200 overflow-hidden"
    >
      {/* Route Corridor Progress Track (visible on sm+ screens) */}
      <div className="hidden sm:block relative mb-6 px-4 lg:px-8">
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-visible relative">
          <div 
            ref={progressLineRef}
            className="h-full bg-gradient-to-r from-[#0038BD] via-[#EF8E01] to-emerald-600 rounded-full w-0 relative"
          />
          {/* Animated Express Van Marker */}
          <div 
            ref={vanIndicatorRef}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border-2 border-[#EF8E01] shadow-md flex items-center justify-center text-[#EF8E01] z-10"
            style={{ left: '0%' }}
            title="Daily Express Morning Run"
          >
            <Truck className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
        
        {/* Left 3-Stop Route Sequence (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
          
          {/* Stop 1: Jalna */}
          <div className="route-stop-node flex items-center gap-3.5 flex-1 min-w-[140px]">
            <div className="w-12 h-12 rounded-full bg-[#0038BD] dark:bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Landmark className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">
                Jalna
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                We pickup today
              </p>
            </div>
          </div>

          {/* Connecting Arrow */}
          <div className="route-connecting-arrow hidden sm:flex items-center justify-center px-1 text-slate-300 dark:text-slate-600">
            <ArrowRight className="w-5 h-5 stroke-[2]" />
          </div>

          {/* Stop 2: Partur */}
          <div className="route-stop-node flex items-center gap-3.5 flex-1 min-w-[150px]">
            <div className="w-12 h-12 rounded-full bg-[#EF8E01] text-white flex items-center justify-center shadow-xs shrink-0">
              <Store className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">
                Partur
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-snug">
                Tomorrow<br />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">6:30 - 8:30 AM</span>
              </p>
            </div>
          </div>

          {/* Connecting Arrow */}
          <div className="route-connecting-arrow hidden sm:flex items-center justify-center px-1 text-slate-300 dark:text-slate-600">
            <ArrowRight className="w-5 h-5 stroke-[2]" />
          </div>

          {/* Stop 3: Mantha */}
          <div className="route-stop-node flex items-center gap-3.5 flex-1 min-w-[150px]">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Building2 className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">
                Mantha
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-snug">
                Through our<br />
                partner network
              </p>
            </div>
          </div>

        </div>

        {/* Divider / Right Delivery Window Box (lg:col-span-4) */}
        <div className="delivery-window-box lg:col-span-4 lg:border-l lg:border-slate-200/80 dark:lg:border-slate-800 lg:pl-6 pt-4 lg:pt-0 border-t border-slate-100 dark:border-slate-800 lg:border-t-0">
          <div className="flex items-start gap-3">
            <div className="text-[#0038BD] dark:text-blue-400 mt-0.5">
              <Clock className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Our Delivery Window
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
                6:30 - 8:30 AM
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5 font-medium">
                On average by 9:00 AM
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
