import React from 'react';
import { MapPin, Navigation, Compass, Sparkles, CheckCircle2, ArrowRightLeft } from 'lucide-react';

interface HeroVanIllustrationProps {
  onOpenBooking?: () => void;
}

export const HeroVanIllustration: React.FC<HeroVanIllustrationProps> = ({ onOpenBooking }) => {
  const [activeDirection, setActiveDirection] = React.useState<'jalna-to-partur' | 'partur-to-jalna'>('jalna-to-partur');

  return (
    <div className="relative w-full select-none" id="hero-illustration-container">
      {/* Background Architectural Glow & Landmark Backdrop */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border border-slate-200/90 shadow-xl p-5 sm:p-7 overflow-hidden">
        
        {/* Direction Switcher Header */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0038BD] bg-[#0038BD]/10 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Navigation className="w-3 h-3 text-[#0038BD]" />
              SH-176 EXPRESS CORRIDOR
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md hidden sm:inline-flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#EF8E01]" />
              48 KM DIRECT
            </span>
          </div>

          <button
            onClick={() => setActiveDirection(prev => prev === 'jalna-to-partur' ? 'partur-to-jalna' : 'jalna-to-partur')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 hover:text-[#0038BD] rounded-lg border border-slate-200 shadow-2xs transition-all active:scale-95"
            title="Switch route direction"
          >
            <ArrowRightLeft className="w-3 h-3 text-[#EF8E01]" />
            <span className="font-semibold">{activeDirection === 'jalna-to-partur' ? 'Jalna ➔ Partur' : 'Partur ➔ Jalna'}</span>
          </button>
        </div>

        {/* Route Pins & Arched Dashed Line Banner */}
        <div className="relative w-full h-24 sm:h-28 flex items-center justify-between px-4 sm:px-8">
          
          {/* Subtle Temple / Landmark Background Silhouette */}
          <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
            <svg viewBox="0 0 500 120" className="w-full h-full" fill="currentColor">
              <path d="M40,110 L40,80 L50,70 L50,50 L60,30 L70,50 L70,70 L80,80 L80,110 Z M120,110 L120,85 L140,85 L140,110 Z M200,110 L200,75 L210,65 L220,40 L230,65 L240,75 L240,110 Z M300,110 L300,60 L320,30 L340,60 L340,110 Z M420,110 L420,70 L430,55 L440,35 L450,55 L460,70 L460,110 Z" />
            </svg>
          </div>

          {/* Jalna Pin */}
          <div className="flex flex-col items-center z-10">
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#0038BD] text-white flex items-center justify-center shadow-md ring-4 ring-[#0038BD]/20 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white/20" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 mt-1.5 tracking-wider">
              JALNA
            </span>
            <span className="text-[9px] font-bold text-[#0038BD] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
              HUB 01
            </span>
          </div>

          {/* Arched Dashed Trajectory SVG */}
          <div className="flex-1 px-3 sm:px-6 relative h-16 flex items-center justify-center">
            <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0038BD" />
                  <stop offset="50%" stopColor="#EF8E01" />
                  <stop offset="100%" stopColor="#EF8E01" />
                </linearGradient>
              </defs>
              <path
                d="M 10 65 Q 150 -15 290 65"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="3.5"
                strokeDasharray="6,6"
                className="animate-[dash_20s_linear_infinite]"
              />
              {/* Traveling Indicator Pulse */}
              <circle cx="150" cy="25" r="5" fill="#EF8E01" className="animate-pulse">
                <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
            <div className="absolute top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs text-[10px] font-extrabold text-slate-700">
              60-75 Min
            </div>
          </div>

          {/* Partur Pin */}
          <div className="flex flex-col items-center z-10">
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#EF8E01] text-white flex items-center justify-center shadow-md ring-4 ring-[#EF8E01]/20 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white/20" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#0038BD] border-2 border-white rounded-full" />
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 mt-1.5 tracking-wider">
              PARTUR
            </span>
            <span className="text-[9px] font-bold text-[#EF8E01] bg-orange-50 px-1.5 py-0.2 rounded border border-orange-100">
              HUB 02
            </span>
          </div>

        </div>

        {/* High-Fidelity Custom Vector Illustration: Joshi Couriers Express Van + Parcel Stacks */}
        <div className="relative mt-3 pt-2">
          <div className="relative w-full max-w-lg mx-auto flex items-end justify-center">
            
            {/* SVG Delivery Van & Boxes Scene */}
            <svg
              viewBox="0 0 540 240"
              className="w-full h-auto drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ground Shadow */}
              <ellipse cx="260" cy="222" rx="220" ry="14" fill="#0f172a" opacity="0.16" />
              <ellipse cx="450" cy="222" rx="60" ry="8" fill="#0f172a" opacity="0.18" />

              {/* === PARCEL STACKS (Right side) === */}
              <g id="parcel-boxes" transform="translate(400, 115)">
                {/* Hand Truck / Trolley Handle */}
                <path d="M-15,100 L-10,-5 L-4,-5 L-9,100" fill="#475569" />
                <circle cx="-10" cy="-5" r="4" fill="#EF8E01" />
                {/* Trolley Wheel */}
                <circle cx="-12" cy="100" r="10" fill="#1e293b" />
                <circle cx="-12" cy="100" r="4" fill="#94a3b8" />

                {/* Box 1 (Bottom Large) */}
                <rect x="0" y="45" width="80" height="60" rx="4" fill="#D97706" />
                <polygon points="0,45 15,35 95,35 80,45" fill="#F59E0B" />
                <polygon points="80,45 95,35 95,95 80,105" fill="#B45309" />
                {/* Tape on Box 1 */}
                <rect x="36" y="45" width="10" height="60" fill="#FDE68A" opacity="0.8" />
                <polygon points="36,45 44,35 54,35 46,45" fill="#FDE68A" opacity="0.9" />
                {/* Up Arrow on Box 1 */}
                <path d="M20,80 L20,70 L15,70 L22,60 L29,70 L24,70 L24,80 Z" fill="#78350F" opacity="0.6" />

                {/* Box 2 (Top Stacked) */}
                <rect x="15" y="-5" width="60" height="45" rx="3" fill="#D97706" />
                <polygon points="15,-5 28,-14 88,-14 75,-5" fill="#FBBF24" />
                <polygon points="75,-5 88,-14 88,31 75,40" fill="#92400E" />
                {/* Tape on Box 2 */}
                <rect x="42" y="-5" width="8" height="45" fill="#FEF08A" opacity="0.8" />
                {/* Fragile Glass icon mark */}
                <circle cx="32" cy="15" r="4" fill="#78350F" opacity="0.5" />

                {/* Small Box 3 (Foreground) */}
                <rect x="-8" y="65" width="45" height="40" rx="3" fill="#F59E0B" />
                <polygon points="-8,65 2,57 47,57 37,65" fill="#FDE68A" />
                <polygon points="37,65 47,57 47,97 37,105" fill="#B45309" />
                <rect x="12" y="65" width="6" height="40" fill="#FEF08A" opacity="0.8" />
              </g>

              {/* === JOSHI COURIERS EXPRESS VAN === */}
              <g id="delivery-van" transform="translate(20, 20)">
                
                {/* Main Van Body Shell */}
                <path
                  d="M40,170 L380,170 L380,60 C380,50 372,42 360,42 L170,42 C160,42 145,45 135,55 L85,95 C75,103 68,115 62,125 L45,135 C38,140 35,148 35,155 L35,165 C35,168 37,170 40,170 Z"
                  fill="#FFFFFF"
                  stroke="#CBD5E1"
                  strokeWidth="2"
                />

                {/* Van Roof Rack / Top Detail */}
                <path d="M175,38 L360,38" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
                <path d="M210,38 L210,42 M280,38 L280,42 M340,38 L340,42" stroke="#94A3B8" strokeWidth="3" />

                {/* Windshield & Front Side Window */}
                <path
                  d="M135,58 L88,98 C82,103 78,110 75,118 L142,118 L142,58 Z"
                  fill="#1E293B"
                  opacity="0.85"
                />
                {/* Window Reflection highlight */}
                <polygon points="125,62 135,62 95,114 85,114" fill="#93C5FD" opacity="0.6" />

                {/* Driver Door Window */}
                <path
                  d="M152,58 L152,118 L210,118 L210,58 Z"
                  fill="#1E293B"
                  opacity="0.85"
                />
                <polygon points="195,62 205,62 170,114 160,114" fill="#93C5FD" opacity="0.5" />

                {/* Side Mirror */}
                <rect x="70" y="112" width="12" height="18" rx="3" fill="#334155" />
                <path d="M78,122 L86,122" stroke="#64748B" strokeWidth="3" />

                {/* Front Bumper & Headlights */}
                <path d="M35,145 L32,165 C32,172 38,176 46,176 L75,176 L75,150 Z" fill="#E2E8F0" />
                {/* Headlight Lamp */}
                <polygon points="40,138 58,138 60,150 38,150" fill="#FEF08A" stroke="#E2E8F0" strokeWidth="1" />
                <polygon points="42,140 56,140 57,148 40,148" fill="#F59E0B" opacity="0.6" />

                {/* Front Grille */}
                <rect x="33" y="153" width="12" height="15" rx="2" fill="#334155" />
                <line x1="33" y1="157" x2="45" y2="157" stroke="#64748B" strokeWidth="1.5" />
                <line x1="33" y1="162" x2="45" y2="162" stroke="#64748B" strokeWidth="1.5" />

                {/* Sleek Racing / Express Accent Stripes */}
                <path d="M142,130 L380,130 L380,138 L142,138 Z" fill="#0038BD" />
                <path d="M142,140 L380,140 L380,144 L142,144 Z" fill="#EF8E01" />

                {/* === JOSHI COURIERS BRAND LOGO ON VAN SIDE === */}
                <g transform="translate(230, 78)">
                  {/* Circular Van Emblem */}
                  <circle cx="0" cy="16" r="16" fill="#0038BD" />
                  <path d="M-8,16 L-2,10 L4,10 L8,16 L-8,16 Z M-8,16 L8,16 L8,21 L-8,21 Z" fill="#FFFFFF" />
                  <circle cx="-4" cy="21" r="2.5" fill="#EF8E01" />
                  <circle cx="4" cy="21" r="2.5" fill="#EF8E01" />
                  
                  {/* Brand Typography */}
                  <text x="24" y="14" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="16" fill="#0038BD" letterSpacing="-0.5">
                    JOSHI
                  </text>
                  <text x="74" y="14" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="16" fill="#EF8E01" letterSpacing="-0.5">
                    COURIERS
                  </text>
                  <text x="24" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="8" fill="#64748B" letterSpacing="0.5">
                    FAST. RELIABLE. LOCAL.
                  </text>
                </g>

                {/* Door Seam Lines & Handles */}
                <line x1="145" y1="50" x2="145" y2="170" stroke="#CBD5E1" strokeWidth="1.5" />
                <line x1="215" y1="50" x2="215" y2="170" stroke="#CBD5E1" strokeWidth="1.5" />
                <line x1="310" y1="50" x2="310" y2="170" stroke="#CBD5E1" strokeWidth="1.5" />
                {/* Door Handles */}
                <rect x="195" y="125" width="12" height="4" rx="2" fill="#475569" />
                <rect x="225" y="125" width="12" height="4" rx="2" fill="#475569" />

                {/* Rear Cargo Door Notch & Rear Lights */}
                <rect x="376" y="80" width="4" height="25" rx="1" fill="#DC2626" />
                <rect x="376" y="108" width="4" height="15" rx="1" fill="#F59E0B" />

                {/* === WHEELS === */}
                {/* Front Wheel */}
                <g transform="translate(100, 170)">
                  {/* Wheel Arch cutout */}
                  <circle cx="0" cy="0" r="32" fill="#1E293B" />
                  <circle cx="0" cy="0" r="28" fill="#334155" />
                  {/* Rim */}
                  <circle cx="0" cy="0" r="18" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
                  <circle cx="0" cy="0" r="8" fill="#0038BD" />
                  {/* Spokes */}
                  <line x1="-14" y1="0" x2="14" y2="0" stroke="#64748B" strokeWidth="2.5" />
                  <line x1="0" y1="-14" x2="0" y2="14" stroke="#64748B" strokeWidth="2.5" />
                </g>

                {/* Rear Wheel */}
                <g transform="translate(325, 170)">
                  <circle cx="0" cy="0" r="32" fill="#1E293B" />
                  <circle cx="0" cy="0" r="28" fill="#334155" />
                  <circle cx="0" cy="0" r="18" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
                  <circle cx="0" cy="0" r="8" fill="#0038BD" />
                  <line x1="-14" y1="0" x2="14" y2="0" stroke="#64748B" strokeWidth="2.5" />
                  <line x1="0" y1="-14" x2="0" y2="14" stroke="#64748B" strokeWidth="2.5" />
                </g>

              </g>
            </svg>

          </div>
        </div>

        {/* Bottom Delivery Status Footnote */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Daily Morning (10:30 AM) &amp; Afternoon (03:30 PM) Runs</span>
          </div>
          <span className="text-[11px] font-extrabold text-[#0038BD] bg-[#0038BD]/10 px-2 py-0.5 rounded">
            Pay on Arrival
          </span>
        </div>

      </div>
    </div>
  );
};
