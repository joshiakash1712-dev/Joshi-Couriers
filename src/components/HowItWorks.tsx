import React from 'react';
import { Smartphone, Package, CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface HowItWorksProps {
  onOpenBooking: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenBooking }) => {
  const shouldReduceMotion = useReducedMotion();

  const steps = [
    {
      num: '01',
      title: 'Book Pickup',
      desc: 'Select your pickup village/city and destination from our 15 route stops.',
      detail: 'Zero advance payment or app download needed.',
      icon: <Smartphone className="w-6 h-6 text-[#0038BD]" strokeWidth={2.2} />,
      accentBg: 'bg-blue-50 border-blue-100 text-[#0038BD]',
    },
    {
      num: '02',
      title: 'We Pick It Up',
      desc: 'Our courier driver arrives directly at your shop or home anywhere along NH-752I.',
      detail: 'Morning (10:30 AM) & Afternoon (03:30 PM) dispatches.',
      icon: <Package className="w-6 h-6 text-[#EF8E01]" strokeWidth={2.2} />,
      accentBg: 'bg-orange-50 border-orange-100 text-[#EF8E01]',
    },
    {
      num: '03',
      title: 'We Deliver',
      desc: 'Direct hand-to-hand delivery to recipient in Jalna, Partur, Mantha or intermediate villages.',
      detail: 'Pay standard delivery fee upon arrival via Cash or UPI.',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" strokeWidth={2.2} />,
      accentBg: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants = {
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
    <section id="how-it-works" className="py-14 sm:py-18 bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center max-w-xl mx-auto mb-10 sm:mb-12"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#0038BD] bg-[#0038BD]/10 px-3 py-1 rounded-md">
            SIMPLE 3-STEP PROCESS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-3">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal">
            Fast, honest, and direct courier service across all 15 corridor locations.
          </p>
        </motion.div>

        {/* 3 Step Cards with Staggered Appearance */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
        >
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={itemVariants}
              id={`step-card-${step.num}`}
              className="relative bg-slate-50/70 hover:bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Step Header with Number & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-black text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    STEP {step.num}
                  </span>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${step.accentBg} shadow-2xs`}>
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  {step.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 text-xs text-slate-500 font-medium">
                {step.detail}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Bottom Action Bar */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-50/50 p-4 sm:p-5 rounded-2xl border border-blue-100/80"
        >
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
            <Clock className="w-4 h-4 text-[#EF8E01] shrink-0" />
            <span><strong>Corridor Operations:</strong> 8:00 AM - 8:00 PM (Monday to Sunday, All 15 stops)</span>
          </div>
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#EF8E01] hover:bg-[#d88001] shadow-xs active:scale-95 transition-all"
          >
            <span>Book Your First Pickup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
