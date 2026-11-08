import React, { useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { gsap } from '../lib/gsap';
import { useGsapContext } from '../hooks/useGsapContext';

interface ThemeToggleProps {
  variant?: 'header' | 'drawer';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'header', className = '' }) => {
  const { isDark, toggleTheme } = useTheme();
  const toggleRef = useRef<HTMLDivElement | HTMLButtonElement>(null);
  const sunIconRef = useRef<HTMLDivElement>(null);
  const moonIconRef = useRef<HTMLDivElement>(null);
  const switchKnobRef = useRef<HTMLSpanElement>(null);
  const isFirstRender = useRef(true);

  // Use our reusable GSAP context hook for automated lifecycle & revert cleanup
  useGsapContext(
    () => {
      // Initial state synchronization without animation flash
      if (isFirstRender.current) {
        isFirstRender.current = false;
        if (isDark) {
          gsap.set(sunIconRef.current, { autoAlpha: 0, scale: 0, rotation: 90 });
          gsap.set(moonIconRef.current, { autoAlpha: 1, scale: 1, rotation: 0 });
          if (switchKnobRef.current) {
            gsap.set(switchKnobRef.current, { x: 20 });
          }
        } else {
          gsap.set(sunIconRef.current, { autoAlpha: 1, scale: 1, rotation: 0 });
          gsap.set(moonIconRef.current, { autoAlpha: 0, scale: 0, rotation: -90 });
          if (switchKnobRef.current) {
            gsap.set(switchKnobRef.current, { x: 0 });
          }
        }
        return;
      }

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { duration: 0.45, ease: 'back.out(1.7)' },
        });

        if (isDark) {
          // Switch to Dark: Smooth rotation & scale out Sun, spin & scale in Moon
          tl.to(sunIconRef.current, {
            rotation: 180,
            scale: 0.1,
            autoAlpha: 0,
            duration: 0.22,
            ease: 'power2.in',
          }).fromTo(
            moonIconRef.current,
            { rotation: -180, scale: 0.1, autoAlpha: 0 },
            { rotation: 0, scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.8)' },
            '-=0.08'
          );

          if (switchKnobRef.current) {
            gsap.to(switchKnobRef.current, {
              x: 20,
              duration: 0.35,
              ease: 'power2.out',
            });
          }
        } else {
          // Switch to Light: Smooth rotation & scale out Moon, spin & scale in Sun
          tl.to(moonIconRef.current, {
            rotation: -180,
            scale: 0.1,
            autoAlpha: 0,
            duration: 0.22,
            ease: 'power2.in',
          }).fromTo(
            sunIconRef.current,
            { rotation: 180, scale: 0.1, autoAlpha: 0 },
            { rotation: 0, scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.8)' },
            '-=0.08'
          );

          if (switchKnobRef.current) {
            gsap.to(switchKnobRef.current, {
              x: 0,
              duration: 0.35,
              ease: 'power2.out',
            });
          }
        }
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (isDark) {
          gsap.to(sunIconRef.current, { autoAlpha: 0, duration: 0.1 });
          gsap.to(moonIconRef.current, { autoAlpha: 1, duration: 0.1 });
          if (switchKnobRef.current) gsap.set(switchKnobRef.current, { x: 20 });
        } else {
          gsap.to(moonIconRef.current, { autoAlpha: 0, duration: 0.1 });
          gsap.to(sunIconRef.current, { autoAlpha: 1, duration: 0.1 });
          if (switchKnobRef.current) gsap.set(switchKnobRef.current, { x: 0 });
        }
      });
    },
    { scope: toggleRef, dependencies: [isDark] }
  );

  if (variant === 'drawer') {
    return (
      <div 
        ref={toggleRef as React.RefObject<HTMLDivElement>}
        className={`flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-colors ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-[#0038BD] dark:text-amber-400 overflow-hidden">
            {/* GSAP animated Sun icon */}
            <div
              ref={sunIconRef}
              className="absolute inset-0 flex items-center justify-center text-amber-500 will-change-transform"
            >
              <Sun className="w-4 h-4 stroke-[2.2]" />
            </div>

            {/* GSAP animated Moon icon */}
            <div
              ref={moonIconRef}
              className="absolute inset-0 flex items-center justify-center text-amber-400 will-change-transform"
            >
              <Moon className="w-4 h-4 fill-amber-400/25 stroke-[2.2]" />
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Appearance
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {isDark ? 'Dark Mode Active' : 'Light Mode Active'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 dark:bg-[#0038BD] transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0038BD]/40"
          role="switch"
          aria-checked={isDark}
        >
          <span className="sr-only">Toggle theme</span>
          <span
            ref={switchKnobRef}
            className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-xs ring-0 flex items-center justify-center will-change-transform"
          >
            {isDark ? (
              <Moon className="w-3 h-3 text-[#0038BD] fill-[#0038BD]/20" />
            ) : (
              <Sun className="w-3 h-3 text-amber-500" />
            )}
          </span>
        </button>
      </div>
    );
  }

  return (
    <button
      ref={toggleRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={toggleTheme}
      id="theme-toggle-btn"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light mode (currently Dark)' : 'Switch to dark mode (currently Light)'}
      className={`group relative w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0038BD]/30 shrink-0 overflow-hidden shadow-2xs hover:scale-105 active:scale-95 ${className}`}
    >
      {/* Subtle radial ambient glow behind the icon */}
      <span 
        className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none ${
          isDark 
            ? 'bg-gradient-to-tr from-amber-400/10 via-blue-500/10 to-transparent opacity-80 group-hover:opacity-100' 
            : 'bg-gradient-to-tr from-amber-400/15 via-orange-300/10 to-transparent opacity-70 group-hover:opacity-100'
        }`}
      />

      {/* GSAP smoothly animated celestial icon container */}
      <div className="relative w-4 h-4 sm:w-[18px] sm:h-[18px] flex items-center justify-center pointer-events-none overflow-hidden">
        {/* GSAP animated Sun icon */}
        <div
          ref={sunIconRef}
          className="absolute inset-0 flex items-center justify-center text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.35)] will-change-transform"
        >
          <Sun className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2.2]" />
        </div>

        {/* GSAP animated Moon icon */}
        <div
          ref={moonIconRef}
          className="absolute inset-0 flex items-center justify-center text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)] will-change-transform"
        >
          <Moon className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-amber-400/25 stroke-[2.2]" />
        </div>
      </div>
    </button>
  );
};
