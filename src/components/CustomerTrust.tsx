import React, { useState } from 'react';
import { Star, Stethoscope, Shirt, Wrench, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface CustomerTrustProps {
  onOpenBooking: () => void;
}

export const CustomerTrust: React.FC<CustomerTrustProps> = ({ onOpenBooking }) => {
  const shouldReduceMotion = useReducedMotion();

  const testimonials = [
    {
      name: 'Dr. R. Deshmukh',
      role: 'Clinic Director, Partur',
      icon: <Stethoscope className="w-5 h-5 text-[#0038BD]" />,
      text: 'We regularly need blood reports and urgent pharma supplies sent between Jalna labs and Partur. Big courier companies take 2-3 days for just 48 km. Joshi Couriers delivers within 90 minutes. Lifesaver for our patients.',
      rating: 5,
      tag: 'Urgent Medical Supplies',
      badge: 'Daily Client',
    },
    {
      name: 'Sunil Khandelwal',
      role: 'Wholesale Retail Merchant, Partur Market',
      icon: <Shirt className="w-5 h-5 text-[#EF8E01]" />,
      text: 'Sending sample bundles and customer orders to Jalna is now completely seamless. The driver comes directly to my shop counter, takes the bundle, and collects payment on delivery. Zero headaches.',
      rating: 5,
      tag: 'Retail & Garments',
      badge: 'Verified Merchant',
    },
    {
      name: 'Anand Agrawal',
      role: 'Agro & Tractor Spares, Jalna MIDC',
      icon: <Wrench className="w-5 h-5 text-emerald-600" />,
      text: 'When farmers in Partur need a critical motor pump or tractor spare part urgently during harvest season, Joshi Couriers puts it on the 10:30 AM morning run. Reliable and very honest pricing.',
      rating: 5,
      tag: 'Machinery & Spares',
      badge: '5+ Years Partner',
    },
  ];

  const comparisonPoints = [
    {
      feature: 'Delivery Turnaround Time',
      traditional: '2 to 3 Business Days (routed via Pune or Aurangabad central hubs)',
      joshi: 'Same-Day (60-90 Minutes Direct Express Transit)',
    },
    {
      feature: 'Doorstep Pickup from Shop / Home',
      traditional: 'You have to stand in line at their far-away branch counter',
      joshi: 'Direct doorstep pickup anywhere in Jalna, Partur, Watur, or Mantha',
    },
    {
      feature: 'Handling & Damage Risk',
      traditional: 'Parcels thrown between 4+ warehouse sorting belts',
      joshi: 'Direct hand-to-hand van transit with 99.9% damage-free record',
    },
    {
      feature: 'Payment & Trust Model',
      traditional: '100% advance payment with complicated dispute forms',
      joshi: 'Pay only upon safe arrival (Cash or UPI). Zero advance needed',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <section id="trust" className="py-20 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800 overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#0038BD] dark:text-blue-400 bg-[#0038BD]/10 dark:bg-blue-950/60 px-3 py-1 rounded-full">
            REAL COMMUNITY PROOF
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-3">
            Trusted by Local Merchants &amp; Families
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-2">
            See how direct daily logistics empowers business between Jalna, Partur, and Mantha.
          </p>
        </motion.div>

        {/* 3 Testimonial Cards Grid with Staggered Motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#EF8E01] text-[#EF8E01]" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800">
                    {item.badge}
                  </span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.name}</h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">{item.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison Table / Bento Banner (Traditional Couriers vs. Joshi Couriers) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-md transition-colors duration-200"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EF8E01] bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-900/60">
                WHY JOSHI COURIERS WINS
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
                Local Point-to-Point vs. National Aggregators
              </h3>
            </div>
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0038BD] hover:bg-[#002d99] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors"
            >
              <span>Switch to Same-Day Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {comparisonPoints.map((row, i) => (
              <div key={i} className="py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {row.feature}
                </div>
                <div className="md:col-span-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 bg-rose-50/60 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-100 dark:border-rose-900/40">
                  <span className="font-semibold text-rose-700 dark:text-rose-400 block mb-0.5">Big Aggregators:</span>
                  {row.traditional}
                </div>
                <div className="md:col-span-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-emerald-50/80 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 mb-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Joshi Couriers:
                  </span>
                  {row.joshi}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
