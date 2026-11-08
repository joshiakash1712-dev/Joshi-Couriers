import React, { useState } from 'react';
import { ChevronDown, MessageCircle, Phone } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface FAQSectionProps {
  onOpenBooking: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenBooking }) => {
  const shouldReduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How fast will my parcel reach Mantha or Partur from Jalna (or vice versa)?',
      a: 'We operate direct point-to-point daily dispatch runs between Jalna, Partur, and Mantha (~65 km). Parcels booked for our morning run (10:30 AM) are delivered within 90-120 minutes on the same day. Parcels booked for the afternoon run (03:30 PM) arrive before 05:30 PM.',
    },
    {
      q: 'Do I need to pay any advance booking fees or deposit?',
      a: 'No! We operate on 100% trust. You pay only the exact delivery fee (e.g. ₹50 - ₹120 depending on parcel type/weight/distance) when the parcel arrives safely at the destination. We accept Cash or instant UPI (Google Pay, PhonePe, Paytm).',
    },
    {
      q: 'Do you offer doorstep pickup from my home, clinic, or shop?',
      a: 'Yes, absolutely. We come directly to your shop, workshop, hospital, or home address across all 15 supported locations: Jalna City, Ramnagar, Sindhi Kalegaon, Chitali, Putali, Viregaon, Watur, Watur Phata, Partur, Belora, Bhuwan, Wazar, Wazar Sarkate, Talegaon, and Mantha.',
    },
    {
      q: 'Can you transport fragile items or medicine samples safely?',
      a: 'Yes! Because your parcel stays directly in our delivery van and is not thrown across automated conveyor belts or intermediate sorting hubs, fragile medical samples, glass bottles, and delicate packages travel 100% safely.',
    },
    {
      q: 'Can you pick up or drop off at intermediate villages along NH-752I?',
      a: 'Yes, we provide full coverage for all 15 hubs and roadside checkpoints along NH-752I including Ramnagar, Sindhi Kalegaon, Chitali, Putali, Viregaon, Watur, Watur Phata, Partur, Belora, Bhuwan, Wazar, Wazar Sarkate, Talegaon, and Mantha. Simply select your location during online booking or WhatsApp us.',
    },
  ];

  // Schema.org FAQPage JSON-LD structured data for Google Search SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <section id="faq" className="py-20 bg-white border-t border-slate-200/80 overflow-hidden">
      {/* JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#0038BD] bg-[#0038BD]/10 px-3 py-1 rounded-full">
            CLEAR &amp; TRANSPARENT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Everything you need to know about our daily Jalna ↔ Partur ↔ Mantha courier runs.
          </p>
        </motion.div>

        {/* FAQ Accordion List with Staggered Motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="space-y-4"
        >
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left bg-slate-50/70 hover:bg-slate-100/80 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 pr-4">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'bg-[#0038BD] text-white rotate-180' : 'bg-slate-200 text-slate-700'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="p-5 sm:p-6 text-sm text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Still have questions banner */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-12 p-6 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div>
            <h4 className="text-base font-bold text-[#0038BD]">Have a specific parcel query?</h4>
            <p className="text-xs text-slate-600 mt-0.5">Call our driver desk directly or chat on WhatsApp anytime.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919404040606"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href="tel:+919404040606"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-800 hover:text-[#0038BD] rounded-xl text-xs font-semibold border border-slate-200 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#0038BD]" />
              <span>+91 94040 40606</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
