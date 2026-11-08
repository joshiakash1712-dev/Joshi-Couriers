import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';

export const NoticeBar: React.FC = () => {
  const noticeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(noticeRef.current, {
          y: 12,
          duration: 0.45,
          ease: 'power2.out',
          clearProps: 'all',
        });
      });
    },
    { scope: noticeRef }
  );

  return (
    <div 
      ref={noticeRef}
      className="w-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100/90 dark:border-blue-900/60 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 text-xs sm:text-sm font-medium text-[#0038BD] dark:text-blue-300 transition-colors duration-200"
    >
      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#0038BD] dark:text-blue-400 shrink-0" strokeWidth={2.2} />
      <span className="min-w-0">
        Parcels picked up today in Jalna will be shipped tomorrow morning.
      </span>
    </div>
  );
};
