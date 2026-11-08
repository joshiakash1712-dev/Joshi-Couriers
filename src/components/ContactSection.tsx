import React from 'react';
import { MessageCircle, Phone, MapPin, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface ContactSectionProps {
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="contact" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* White Card Banner from Visual Reference 1 & 3 */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Parcel Hand-Truck / Trolley Illustration with WhatsApp Icon */}
            <div className="lg:col-span-3 flex justify-center items-center">
              <div className="relative">
                {/* SVG Parcel Trolley */}
                <svg viewBox="0 0 160 160" className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-md">
                  {/* Wheel */}
                  <circle cx="45" cy="135" r="14" fill="#334155" />
                  <circle cx="45" cy="135" r="6" fill="#94A3B8" />
                  {/* Frame */}
                  <path d="M40,135 L65,30 L73,32 L48,135 Z" fill="#64748B" />
                  <path d="M62,30 L80,25" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
                  <path d="M45,135 L125,135" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                  
                  {/* Stacking Boxes */}
                  {/* Box 1 (Bottom) */}
                  <rect x="55" y="85" width="65" height="45" rx="3" fill="#D97706" />
                  <polygon points="55,85 70,75 135,75 120,85" fill="#F59E0B" />
                  <polygon points="120,85 135,75 135,120 120,130" fill="#B45309" />
                  <rect x="85" y="85" width="8" height="45" fill="#FEF08A" opacity="0.8" />
                  
                  {/* Box 2 (Top) */}
                  <rect x="65" y="45" width="50" height="36" rx="3" fill="#D97706" />
                  <polygon points="65,45 77,37 127,37 115,45" fill="#FBBF24" />
                  <polygon points="115,45 127,37 127,73 115,81" fill="#92400E" />
                  <rect x="87" y="45" width="6" height="36" fill="#FEF08A" opacity="0.8" />
                </svg>

                {/* WhatsApp Floating Badge */}
                <a
                  href="https://wa.me/919404040606"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-0 w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform ring-4 ring-white"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="w-6 h-6 fill-white" />
                </a>
              </div>
            </div>

            {/* Center: Headings & Direct WhatsApp CTA Button */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Need to send a parcel?
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Contact us today for fast and hassle-free daily delivery between Jalna, Partur, and Mantha across all 15 stops.
              </p>

              {/* Green Bordered WhatsApp Pill Button from Reference 1 */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="https://wa.me/919404040606?text=Hi%20Joshi%20Couriers,%20I%20want%20to%20send%20a%20parcel%20on%20the%20Jalna-Partur-Mantha%20route."
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-section-whatsapp-btn"
                  className="inline-flex flex-col items-center justify-center px-6 py-3.5 rounded-2xl border-2 border-[#10B981] bg-white hover:bg-emerald-50 text-emerald-800 shadow-xs hover:shadow-md transition-all group w-full sm:w-auto"
                >
                  <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-emerald-700 group-hover:text-emerald-800">
                    <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366]/20" />
                    <span>Contact Us on WhatsApp</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600">wa.me/919404040606</span>
                </a>

                {/* Instant Book Pickup Button */}
                <button
                  onClick={onOpenBooking}
                  className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm text-white bg-[#EF8E01] hover:bg-[#d88001] shadow-md shadow-[#EF8E01]/20 transition-all active:scale-95 w-full sm:w-auto"
                >
                  <span>Book Pickup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Clean Contact Detail List (Phone, WhatsApp, Location) */}
            <div className="lg:col-span-4 bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-4">
              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-[#0038BD] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Phone</span>
                  <a href="tel:+919404040606" className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#0038BD]">
                    +91 94040 40606
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">WhatsApp</span>
                  <a
                    href="https://wa.me/919404040606"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-700"
                  >
                    +91 94040 40606
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-[#EF8E01] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Location</span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 block">
                    Jalna, Maharashtra, India
                  </span>
                  <span className="text-xs text-slate-500">Connecting 15 Hubs: Jalna ↔ Partur ↔ Mantha</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
