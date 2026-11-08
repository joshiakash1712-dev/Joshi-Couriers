import React, { useState } from 'react';
import { ChevronDown, MapPin, Truck, Wallet, MessageSquare, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { ServiceOffer } from '../types';

interface WhatWeOfferListProps {
  onOpenBooking: () => void;
}

export const WhatWeOfferList: React.FC<WhatWeOfferListProps> = ({ onOpenBooking }) => {
  const [expandedId, setExpandedId] = useState<string>('01');

  const offers: ServiceOffer[] = [
    {
      id: '01',
      num: '01',
      title: 'Pickup',
      shortDesc: 'We collect your parcel from your location in Jalna or Partur.',
      fullDesc: 'No need to travel to a busy booking counter. Share your location via WhatsApp or our booking form, and our driver will pick up your parcel directly from your home, store, clinic, or workshop.',
      highlights: [
        'Doorstep collection anywhere in Jalna or Partur municipal limits',
        'Morning and afternoon pickup slots every business day',
        'Immediate physical receipt / WhatsApp confirmation upon pickup',
      ],
      iconName: 'MapPin',
    },
    {
      id: '02',
      num: '02',
      title: 'Delivery',
      shortDesc: 'Reliable delivery between the two cities, no unnecessary delays.',
      fullDesc: 'Direct point-to-point transport between Jalna and Partur (~48 km). Parcels do not get rerouted through distant state hubs or sorting warehouses, eliminating transit damage and delays.',
      highlights: [
        'Same-day express delivery for morning dispatches (within 2-3 hours)',
        'Direct hand-to-hand delivery to recipient address or local shop',
        'Special handling for sensitive medical files, spare parts, and retail goods',
      ],
      iconName: 'Truck',
    },
    {
      id: '03',
      num: '03',
      title: 'Payment',
      shortDesc: 'Pay only the delivery charge on arrival - no advance needed.',
      fullDesc: 'We operate on local trust. You or the recipient can pay the standard courier charges only once the parcel safely reaches its destination.',
      highlights: [
        'Zero advance deposit or hidden booking charges',
        'Multiple payment options: Cash on Delivery (COD) or UPI (GPay, PhonePe, Paytm)',
        'Flat, transparent local rates based on standard weight brackets',
      ],
      iconName: 'Wallet',
    },
    {
      id: '04',
      num: '04',
      title: 'Contact',
      shortDesc: 'Reach us directly on WhatsApp for any questions.',
      fullDesc: 'Speak directly with our 2-person father-son courier team. No automated robotic IVR menus, no ticket numbers - just real, honest local communication.',
      highlights: [
        'Instant WhatsApp chat at +91 9404040606',
        'Direct call availability from 8:00 AM to 8:30 PM daily',
        'Real-time status updates directly from the driver on duty',
      ],
      iconName: 'MessageSquare',
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? '' : id));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MapPin':
        return <MapPin className="w-5 h-5" />;
      case 'Truck':
        return <Truck className="w-5 h-5" />;
      case 'Wallet':
        return <Wallet className="w-5 h-5" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-white border-y border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0038BD] bg-[#0038BD]/10 px-3 py-1 rounded-full">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            What We Offer
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-2">
            A straightforward, honest 4-step local delivery model built for everyday ease.
          </p>
        </div>

        {/* 01/02/03/04 Interactive Expandable List */}
        <div className="space-y-4" id="what-we-offer-list">
          {offers.map((offer) => {
            const isExpanded = expandedId === offer.id;

            return (
              <div
                key={offer.id}
                id={`offer-item-${offer.id}`}
                className={`rounded-2xl transition-all duration-200 border ${
                  isExpanded
                    ? 'bg-slate-50/90 border-[#0038BD]/40 shadow-md ring-1 ring-[#0038BD]/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                {/* Clickable Row Header */}
                <button
                  type="button"
                  onClick={() => toggleExpand(offer.id)}
                  aria-expanded={isExpanded}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                >
                  {/* Left: Number & Title & Short Preview */}
                  <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                    <span
                      className={`text-xl sm:text-2xl font-mono font-bold shrink-0 transition-colors ${
                        isExpanded ? 'text-[#EF8E01]' : 'text-slate-400'
                      }`}
                    >
                      {offer.num}
                    </span>

                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6 flex-1 min-w-0">
                      <span className="text-lg sm:text-xl font-bold text-slate-900 shrink-0">
                        {offer.title}
                      </span>
                      <span className="text-sm text-slate-600 font-normal truncate hidden sm:inline-block">
                        → &nbsp; {offer.shortDesc}
                      </span>
                    </div>
                  </div>

                  {/* Right: Expand Indicator */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isExpanded
                          ? 'bg-[#0038BD] text-white rotate-180'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </div>
                </button>

                {/* Expandable Content Panel */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-200/60 animate-in fade-in duration-200">
                    {/* Mobile short desc fallback if hidden above */}
                    <p className="text-sm font-semibold text-[#0038BD] mb-2 sm:hidden">
                      {offer.shortDesc}
                    </p>

                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
                      {offer.fullDesc}
                    </p>

                    {/* Feature Highlights */}
                    <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2 mb-4">
                      {offer.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Contextual Action Button */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-[#EF8E01]" />
                        <span>Jalna ↔ Partur Daily Service</span>
                      </div>

                      {offer.id === '01' || offer.id === '02' ? (
                        <button
                          onClick={onOpenBooking}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0038BD] hover:bg-[#002d99] rounded-lg transition-colors shadow-sm"
                        >
                          <span>Schedule This Now</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <a
                          href="https://wa.me/919404040606?text=Hi%20Joshi%20Couriers,%20I%20have%20a%20query%20about%20your%20services."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>Ask on WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
