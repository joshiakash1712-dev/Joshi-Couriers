import React, { useState } from 'react';
import { ChevronDown, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

type FaqCategory = 'all' | 'timing' | 'pricing' | 'parcels';

interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, 'all'>;
  categoryLabel: string;
  q: string;
  a: string;
}

interface FAQSectionProps {
  onOpenBooking: () => void;
}

const FAQS: FaqItem[] = [
  {
    id: 'delivery-timing-window',
    category: 'timing',
    categoryLabel: 'Delivery Timing',
    q: 'When are parcels picked up in Jalna and delivered in Partur or Mantha?',
    a: 'Parcels collected today in Jalna are loaded directly into our Mahindra Maxximo (MH21 V 6370), departing Jalna between 4:00 AM and 5:00 AM. The vehicle reaches Partur by 6:00 AM to 6:30 AM, and doorstep hand-to-hand deliveries are completed between 6:30 AM and 8:30 AM (on average by 9:00 AM). Connections onward to Mantha are delivered between 8:30 AM and 10:00 AM via our trusted partner network.',
  },
  {
    id: 'pickup-cutoff-time',
    category: 'timing',
    categoryLabel: 'Delivery Timing',
    q: 'What is the booking cutoff for next-morning delivery?',
    a: 'Book your doorstep pickup anytime during business hours today, and Anant Joshi or Akash Joshi will collect your parcel on the same day for tomorrow morning dispatch. For urgent late-evening shop pickups in Jalna, call or WhatsApp +91 94040 40606 before 8:30 PM to confirm van loading space.',
  },
  {
    id: 'route-coverage-stops',
    category: 'timing',
    categoryLabel: 'Delivery Timing',
    q: 'Do you pick up or drop off at villages along the Jalna to Mantha highway?',
    a: 'Yes. We cover all 15 hubs and roadside checkpoints along the NH-752I and SH-176 corridor: Jalna, Ramnagar, Sindhi Kalegaon, Chitali, Putali, Viregaon, Watur, Watur Phata, Partur, Belora, Bhuwan, Wazar, Wazar Sarkate, Talegaon, and Mantha. Select any stop directly inside the booking form.',
  },
  {
    id: 'pricing-range-breakdown',
    category: 'pricing',
    categoryLabel: 'Pricing & Payment',
    q: 'How much does a parcel delivery cost and how is the fare calculated?',
    a: 'Standard shipments from Jalna to Partur start at a ₹70 base fare and typically range from ₹70 to ₹130 depending on weight bracket and commodity type. Shipments under 1 kg start at ₹70, medium parcels (1 to 5 kg) range from ₹85 to ₹110, heavy commercial bundles (5 to 25 kg) range from ₹115 to ₹145, and onward deliveries to Mantha or Talni include a ₹20 extension fee (capped at ₹160).',
  },
  {
    id: 'advance-payment-cod',
    category: 'pricing',
    categoryLabel: 'Pricing & Payment',
    q: 'Do I need to pay any advance fee or deposit while booking?',
    a: 'No advance payment is required. You pay the exact delivery charge only after the parcel arrives safely at the destination. Both sender-side and receiver-side payments are accepted via Cash or UPI (Google Pay, PhonePe, Paytm) upon hand-to-hand handover.',
  },
  {
    id: 'accepted-parcel-types',
    category: 'parcels',
    categoryLabel: 'Accepted Parcels',
    q: 'What types of parcels and goods are accepted on the morning run?',
    a: 'We carry business and personal shipments up to 25 kg per bundle, including textile and garment wholesale bales, auto and machinery spare parts, medicines and diagnostic samples, documents and legal papers, packaged sweets or dry food items, and general retail boxes.',
  },
  {
    id: 'fragile-and-restricted-items',
    category: 'parcels',
    categoryLabel: 'Accepted Parcels',
    q: 'Are fragile medical items safe, and what items are not allowed?',
    a: 'Because parcels stay inside our dedicated vehicle with zero central sorting hubs or conveyor belt drops, fragile medical kits, glassware, and electronics travel safely in the cabin. For safety and legal compliance, we do not accept flammable fuels, hazardous chemicals, pressurized cylinders, loose unsealed liquids, or prohibited contraband.',
  },
];

const CATEGORY_TABS: { id: FaqCategory; label: string }[] = [
  { id: 'all', label: 'All Questions' },
  { id: 'timing', label: 'Delivery Timing' },
  { id: 'pricing', label: 'Pricing & Payment' },
  { id: 'parcels', label: 'Accepted Parcels' },
];

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenBooking }) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all');
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  const visibleFaqs =
    activeCategory === 'all'
      ? FAQS
      : FAQS.filter((item) => item.category === activeCategory);

  const handleCategoryChange = (category: FaqCategory) => {
    setActiveCategory(category);
    const firstInCategory =
      category === 'all'
        ? FAQS[0]
        : FAQS.find((item) => item.category === category);
    setOpenId(firstInCategory ? firstInCategory.id : null);
  };

  // Schema.org FAQPage JSON-LD structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-section-heading"
      className="w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-5 sm:p-7 lg:p-8 transition-colors duration-200"
    >
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header + Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0038BD] dark:text-blue-400">
            Clear Answers Before You Book
          </p>
          <h2
            id="faq-section-heading"
            className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1 text-balance"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
            Details on morning delivery timings, fare slabs, cash-on-delivery terms, and accepted cargo along the Jalna, Partur, and Mantha corridor.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter questions by topic"
          className="flex flex-wrap sm:flex-nowrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl self-start lg:self-end"
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(tab.id)}
                className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038BD] ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-[#0038BD] dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Flat Hairline-Separated Accordion List (Zero Nested Cards) */}
      <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
        {visibleFaqs.map((faq, idx) => {
          const isOpen = openId === faq.id;
          const panelId = `faq-panel-${faq.id}`;
          const buttonId = `faq-btn-${faq.id}`;

          return (
            <div key={faq.id} className="py-1">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full min-h-[48px] py-4 px-2 sm:px-3 flex items-start sm:items-center justify-between gap-4 text-left rounded-xl hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038BD]"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span className="tabular-nums font-mono text-[#0038BD] dark:text-blue-400">
                      0{idx + 1}.
                    </span>
                    <span aria-hidden="true">/</span>
                    <span>{faq.categoryLabel}</span>
                  </div>
                  <span className="block text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {faq.q}
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-1 sm:mt-0 transition-transform duration-200 ${
                    isOpen
                      ? 'bg-[#0038BD] text-white rotate-180'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="px-2 sm:px-3 pb-4 pt-1"
                  >
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-[70ch]">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Bottom Direct Help & Booking Action Strip */}
      <div className="mt-4 pt-5 border-t border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            Have a custom bulk parcel or route inquiry?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Speak directly with Anant Joshi or Akash Joshi before dispatching.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenBooking}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#EF8E01] hover:bg-[#d88001] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF8E01]"
          >
            <span>Book Pickup</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="https://wa.me/919404040606?text=Hi%20Joshi%20Couriers,%20I%20have%20a%20question%20about%20sending%20a%20parcel."
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Desk</span>
          </a>

          <a
            href="tel:+919404040606"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038BD]"
          >
            <Phone className="w-4 h-4 text-[#0038BD] dark:text-blue-400" />
            <span className="tabular-nums">+91 94040 40606</span>
          </a>
        </div>
      </div>
    </section>
  );
};
