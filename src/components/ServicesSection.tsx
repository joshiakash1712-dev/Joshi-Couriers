import React from 'react';
import { 
  Pill, 
  ShoppingBag, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  Zap
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface ServicesSectionProps {
  onOpenBooking: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBooking }) => {
  const shouldReduceMotion = useReducedMotion();

  const services = [
    {
      id: 'pharma',
      title: 'Medicines & Medical Samples',
      marathiTitle: 'औषधे व लॅब सॅम्पल्स',
      desc: 'Urgent prescription medicines, surgical items, pathology blood/urine samples, and pharmacy replenishment.',
      features: ['Priority dispatch & gentle handling', 'Direct drop at clinics / hospitals', 'Same-day urgent courier'],
      icon: <Pill className="w-6 h-6 text-emerald-600" strokeWidth={2.2} />,
      price: 'From ₹50',
      badge: 'Priority Transit',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    {
      id: 'retail',
      title: 'Retail & Wholesale Bundles',
      marathiTitle: 'कापड व रिटेल पार्सल',
      desc: 'Garment bundles, readymade suits, shoes, accessories, packaged inventory, and shop-to-shop merchandise.',
      features: ['Up to 25 kg parcel bundles', 'Daily merchant transfers', 'Zero loss record since 2019'],
      icon: <ShoppingBag className="w-6 h-6 text-[#EF8E01]" strokeWidth={2.2} />,
      price: 'From ₹60',
      badge: 'Merchant Special',
      badgeColor: 'bg-orange-100 text-[#EF8E01] border-orange-200',
    },
    {
      id: 'parts',
      title: 'Machinery & Auto Spares',
      marathiTitle: 'मशनरी व ऑटो स्पेअर पार्टस्',
      desc: 'Tractor components, motor pump parts, workshop tools, hardware supplies, and industrial fittings.',
      features: ['Direct pickup from Jalna MIDC / APMC', 'Heavy packaging protection', 'Urgent breakdown support'],
      icon: <Wrench className="w-6 h-6 text-slate-700" strokeWidth={2.2} />,
      price: 'From ₹70',
      badge: 'Heavy Ready',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
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
    <section id="services" className="py-16 sm:py-20 bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#0038BD] bg-[#0038BD]/10 px-3 py-1 rounded-md">
            WHAT WE CARRY
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Tailored Courier Services for Every Need
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Whether for Jalna commercial markets, Partur retail shops, or Mantha clinics, we handle every parcel with dedicated care.
          </p>
        </motion.div>

        {/* 4 Cards Grid (3 Services + 1 Merchant Account Card) with Staggered Motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              id={`service-card-${service.id}`}
              className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Icon, Badge, Price */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-xs group-hover:scale-105 transition-transform">
                    {service.icon}
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${service.badgeColor}`}>
                      {service.badge}
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {service.price}
                    </span>
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#0038BD] transition-colors leading-snug">
                  {service.title}
                </h3>
                <span className="text-xs font-bold text-[#EF8E01] block mb-2 font-hindi">
                  {service.marathiTitle}
                </span>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {service.desc}
                </p>

                {/* Checklist Features */}
                <ul className="space-y-1.5 pt-3 border-t border-slate-200/70 text-xs text-slate-700">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  Daily Corridor Run
                </span>
                <button
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0038BD] group-hover:text-[#EF8E01] transition-colors"
                >
                  <span>Book Pickup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Custom Bulk / Merchant Solution Card */}
          <motion.div
            variants={cardVariants}
            className="bg-[#0038BD] text-white rounded-3xl p-6 border border-blue-900 shadow-xl flex flex-col justify-between relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#EF8E01] mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EF8E01] text-white inline-block mb-2">
                Business &amp; Wholesale
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                Merchant Contract &amp; Daily Account
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed mt-2">
                Do you ship daily between Jalna wholesale markets and Partur/Mantha retail shops? Get priority slots and monthly consolidated billing.
              </p>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={onOpenBooking}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <span>Open Merchant Account</span>
                <ArrowRight className="w-4 h-4 text-[#0038BD]" />
              </button>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
