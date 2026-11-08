import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { Sparkles, Navigation, ShieldCheck } from 'lucide-react';
import vehicleImage from '../assets/images/real_courier_van_1787573569107.jpg';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const vanCardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Hero entrance timeline: zero blank flashes (no autoAlpha: 0), clean transform offsets
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out', duration: 0.65 },
        });

        tl.from('.hero-badge', {
          y: -10,
          duration: 0.45,
          clearProps: 'all',
        })
          .from(
            '.hero-title-line',
            {
              y: 18,
              stagger: 0.08,
              duration: 0.55,
              clearProps: 'all',
            },
            '-=0.2'
          )
          .from(
            '.hero-desc',
            {
              y: 14,
              duration: 0.5,
              clearProps: 'all',
            },
            '-=0.25'
          )
          .from(
            '.hero-highlights',
            {
              y: 10,
              stagger: 0.06,
              duration: 0.45,
              clearProps: 'all',
            },
            '-=0.3'
          )
          .from(
            vanCardRef.current,
            {
              x: 20,
              duration: 0.7,
              ease: 'power2.out',
              clearProps: 'all',
            },
            '-=0.35'
          )
          .from(
            '.hero-floating-pill',
            {
              scale: 0.92,
              y: 8,
              duration: 0.4,
              clearProps: 'all',
            },
            '-=0.2'
          );

        // Gentle floating vibration loop on the delivery vehicle card (mimicking road travel)
        gsap.to(vanCardRef.current, {
          y: -5,
          duration: 2.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 0.8,
        });

        // Interactive mouse parallax tilt using high-performance quickTo
        if (vanCardRef.current) {
          const card = vanCardRef.current;
          const xTo = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power2.out' });
          const yTo = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power2.out' });

          const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const xVal = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
            const yVal = -((e.clientY - rect.top) / rect.height - 0.5) * 8;
            xTo(xVal);
            yTo(yVal);
          };

          const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
          };

          card.addEventListener('mousemove', handleMouseMove);
          card.addEventListener('mouseleave', handleMouseLeave);

          return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
          };
        }
      });
    },
    { scope: heroRef }
  );

  return (
    <section 
      ref={heroRef}
      className="relative pt-6 pb-4 sm:pt-10 sm:pb-8 bg-white dark:bg-slate-900/50 rounded-3xl border border-transparent dark:border-slate-800/80 overflow-hidden transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Hero: Left Business Proposition | Right Real Vehicle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Honest Business Explanation */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left z-10">
            
            {/* Express Route Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-[#0038BD] dark:text-blue-400 text-xs font-bold tracking-wide">
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
              <span>Jalna ➔ Partur Morning Dedicated Express</span>
            </div>

            {/* Approved 3-Line Headline with Highlighted Location Names */}
            <h1 className="text-[clamp(1.5rem,5.5vw,2.75rem)] font-black text-slate-900 dark:text-slate-50 tracking-tight leading-[1.18]">
              <span className="hero-title-line block">
                We pickup in <span className="text-[#0038BD] dark:text-blue-400 font-black">Jalna</span>.
              </span>
              <span className="hero-title-line block">
                We ship to <span className="text-[#0038BD] dark:text-blue-400 font-black">Partur</span>.
              </span>
              <span className="hero-title-line block">
                We connect to <span className="text-[#0038BD] dark:text-blue-400 font-black">Mantha</span>.
              </span>
            </h1>

            {/* Approved Business Explanation Paragraph */}
            <p className="hero-desc text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-lg font-normal">
              Parcels picked up in Jalna are shipped to Partur <strong className="font-bold text-slate-900 dark:text-slate-100">next morning</strong>. From Partur, we connect through our trusted partners and deliver up to Mantha. We work with <strong className="font-bold text-slate-900 dark:text-slate-100">wholesalers, retailers, shops, courier offices &amp; businesses</strong>.
            </p>

            {/* Micro value highlights */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="hero-highlights inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200/80 dark:border-slate-700/80">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Hand-to-Hand Delivery
              </span>
              <span className="hero-highlights inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200/80 dark:border-slate-700/80">
                <Sparkles className="w-3.5 h-3.5 text-[#EF8E01]" />
                Zero Hub Misplacement
              </span>
            </div>

          </div>

          {/* Right Column: Authentic Real Courier Vehicle (Photographed in Morning Light) with 3D perspective */}
          <div className="lg:col-span-6 relative [perspective:1000px]">
            <div 
              ref={vanCardRef}
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 [transform-style:preserve-3d]"
            >
              <img
                src={vehicleImage}
                alt="Joshi Couriers white delivery van on morning route from Jalna to Partur"
                className="w-full h-auto object-cover object-center max-h-[380px] sm:max-h-[420px] select-none"
                loading="eager"
              />
              {/* Edge blend gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Floating Route Pill on Top of Vehicle */}
              <div className="hero-floating-pill absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto bg-slate-950/85 backdrop-blur-md text-white border border-white/10 rounded-xl px-3.5 py-2 flex items-center gap-3 shadow-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Morning Dispatch Corridor
                  </span>
                  <span className="text-xs font-black text-white">
                    Jalna (4:30 AM) ➔ Partur (6:30 AM)
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

