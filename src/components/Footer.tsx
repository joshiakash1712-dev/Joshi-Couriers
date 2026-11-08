import React from 'react';
import { 
  Box, 
  MessageCircle, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Handshake, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  return (
    <footer className="bg-[#002888] dark:bg-slate-950 text-white border-t border-blue-900/80 dark:border-slate-800 w-full transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* Column 1: Brand & Bio (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0038BD] shadow-md">
                <Box className="w-6 h-6 text-[#EF8E01]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-tight">
                  Joshi Couriers
                </span>
                <span className="text-[11px] font-bold text-[#EF8E01] tracking-wider uppercase">
                  Fast. Reliable. Local.
                </span>
              </div>
            </div>

            <p className="text-sm text-blue-100/90 leading-relaxed max-w-sm">
              Business-focused local courier run personally by father &amp; son. We pickup daily in Jalna, ship to Partur next morning (6:30-8:30 AM), and connect up to Mantha through trusted partners.
            </p>

            <div className="pt-1 text-xs text-blue-200 font-medium">
              <span>Jalna ➔ Partur ➔ Mantha Corridor</span>
            </div>
          </div>

          {/* Column 2: Trusted Local Service (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 text-[#EF8E01]">
              <ShieldCheck className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Trusted Local Service
              </h4>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-blue-100">
              <li className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[#EF8E01] shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white block font-bold">No Central Sorting</strong>
                  <span className="text-xs text-blue-200">Direct movement without hub rerouting</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                  <Handshake className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white block font-bold">Hand-to-Hand Delivery</strong>
                  <span className="text-xs text-blue-200">Handled directly by father &amp; son</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-blue-200 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white block font-bold">Timely &amp; Safe</strong>
                  <span className="text-xs text-blue-200">Next-morning arrival with zero damage</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Daily Route Schedule (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-[#EF8E01]">
              <Clock className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Route Schedule
              </h4>
            </div>

            <ul className="space-y-2.5 text-xs text-blue-100 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-white block font-bold">4:00 - 5:00 AM</strong>
                  <span>Depart Jalna</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EF8E01] mt-1.5 shrink-0" />
                <div>
                  <strong className="text-white block font-bold">6:00 - 6:30 AM</strong>
                  <span>Arrive Partur</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-white block font-bold">6:30 - 8:30 AM</strong>
                  <span>Deliveries &amp; Mantha</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#EF8E01]">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-blue-100">
              <a
                href="tel:+919404040606"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-white font-bold"
              >
                <Phone className="w-4 h-4 text-[#EF8E01]" />
                <span>+91 94040 40606</span>
              </a>

              <a
                href="https://wa.me/919404040606?text=Hi%20Joshi%20Couriers,%20I%20want%20to%20send%20a%20parcel%20from%20Jalna."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-white font-bold"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>

              <div className="pt-1">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#EF8E01] hover:bg-[#d88001] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Book Doorstep Pickup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-blue-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-300">
          <p>© {new Date().getFullYear()} Joshi Couriers. All rights reserved. Jalna • Partur • Mantha.</p>
          <p className="font-semibold text-blue-200">Handled personally by father &amp; son team.</p>
        </div>
      </div>
    </footer>
  );
};
